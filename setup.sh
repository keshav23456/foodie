#!/bin/bash

# ─────────────────────────────────────────────
#  FoodApp — One-Command Setup Script
# ─────────────────────────────────────────────

set -e  # Exit on any error

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

log()    { echo -e "${CYAN}[FoodApp]${NC} $1"; }
success(){ echo -e "${GREEN}[✓]${NC} $1"; }
warn()   { echo -e "${YELLOW}[!]${NC} $1"; }
error()  { echo -e "${RED}[✗]${NC} $1"; exit 1; }

echo ""
echo -e "${RED}  ███████╗ ██████╗  ██████╗ ██████╗      █████╗ ██████╗ ██████╗ ${NC}"
echo -e "${RED}  ██╔════╝██╔═══██╗██╔═══██╗██╔══██╗    ██╔══██╗██╔══██╗██╔══██╗${NC}"
echo -e "${RED}  █████╗  ██║   ██║██║   ██║██║  ██║    ███████║██████╔╝██████╔╝${NC}"
echo -e "${RED}  ██╔══╝  ██║   ██║██║   ██║██║  ██║    ██╔══██║██╔═══╝ ██╔═══╝ ${NC}"
echo -e "${RED}  ██║     ╚██████╔╝╚██████╔╝██████╔╝    ██║  ██║██║     ██║     ${NC}"
echo -e "${RED}  ╚═╝      ╚═════╝  ╚═════╝ ╚═════╝     ╚═╝  ╚═╝╚═╝     ╚═╝     ${NC}"
echo ""
echo -e "  ${CYAN}Zomato-like Food Delivery Platform${NC}"
echo ""

# ── 1. Check Node.js ──────────────────────────
log "Checking Node.js..."
if ! command -v node &> /dev/null; then
  error "Node.js is not installed. Install it from https://nodejs.org (v16+)"
fi
NODE_VER=$(node -v)
success "Node.js $NODE_VER found"

# ── 2. Check npm ──────────────────────────────
if ! command -v npm &> /dev/null; then
  error "npm is not installed."
fi
success "npm $(npm -v) found"

# ── 3. Check/Start MongoDB ────────────────────
log "Checking MongoDB..."
if command -v brew &> /dev/null; then
  # Try community editions in order
  MONGO_SVC=""
  for svc in mongodb-community@7.0 mongodb-community@6.0 mongodb-community; do
    if brew services list 2>/dev/null | grep -q "^$svc"; then
      MONGO_SVC=$svc
      break
    fi
  done

  if [ -n "$MONGO_SVC" ]; then
    STATUS=$(brew services list 2>/dev/null | grep "^$MONGO_SVC" | awk '{print $2}')
    if [ "$STATUS" != "started" ]; then
      log "Starting MongoDB ($MONGO_SVC)..."
      brew services restart "$MONGO_SVC" > /dev/null 2>&1
      sleep 2
    fi
    success "MongoDB started via Homebrew ($MONGO_SVC)"
  elif command -v mongod &> /dev/null; then
    warn "MongoDB found but not managed by Homebrew — assuming it's running."
  else
    warn "MongoDB not found via Homebrew. If it's installed another way, make sure it's running on port 27017."
  fi
elif command -v systemctl &> /dev/null; then
  systemctl is-active --quiet mongod && success "MongoDB (systemd) is running" || {
    log "Starting MongoDB via systemctl..."
    sudo systemctl start mongod
    success "MongoDB started"
  }
elif command -v mongod &> /dev/null; then
  warn "mongod found — assuming it's already running on port 27017."
else
  warn "Could not detect MongoDB. Make sure MongoDB is running on port 27017 before the app starts."
fi

# ── 4. Create .env if missing ─────────────────
log "Checking .env..."
if [ ! -f ".env" ]; then
  if [ -f ".env.example" ]; then
    cp .env.example .env
    warn ".env created from .env.example — review it if needed."
  else
    cat > .env << 'EOF'
PORT=5500
MONGO_URI=mongodb://127.0.0.1:27017/foodapp
JWT_SECRET=foodapp_jwt_secret_key_2024
STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_KEY_HERE
CLIENT_URL=http://localhost:3000
EOF
    warn ".env created with defaults."
  fi
else
  success ".env already exists"
fi

# ── 5. Install backend dependencies ──────────
log "Installing backend dependencies..."
npm install --silent
success "Backend dependencies installed"

# ── 6. Install frontend dependencies ─────────
log "Installing frontend dependencies..."
cd client
npm install --silent
cd ..
success "Frontend dependencies installed"

# ── 7. Fix permissions (macOS Downloads quarantine) ──
log "Fixing file permissions..."
chmod +x client/node_modules/.bin/* 2>/dev/null || true
if command -v xattr &> /dev/null; then
  xattr -dr com.apple.quarantine client/node_modules/ 2>/dev/null || true
fi
success "Permissions fixed"

# ── 8. Seed database ─────────────────────────
log "Seeding database with restaurants and menu items..."
node seed.js
success "Database seeded"

# ── 9. Kill any old processes on ports 3000 / 5500 ──
log "Clearing ports 3000 and 5500..."
lsof -ti:5500 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 1
success "Ports cleared"

# ── 10. Start backend ─────────────────────────
log "Starting backend server (port 5500)..."
node server.js > /tmp/foodapp-backend.log 2>&1 &
BACKEND_PID=$!
sleep 2

if kill -0 $BACKEND_PID 2>/dev/null; then
  success "Backend running (PID $BACKEND_PID)"
else
  error "Backend failed to start. Check /tmp/foodapp-backend.log"
fi

# ── 11. Start frontend ────────────────────────
log "Starting frontend (port 3000)..."
cd client
BROWSER=none npm start > /tmp/foodapp-frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

log "Waiting for React to compile (this takes ~30 seconds)..."
TIMEOUT=90
ELAPSED=0
while ! grep -q "compiled\|ERROR" /tmp/foodapp-frontend.log 2>/dev/null; do
  sleep 3
  ELAPSED=$((ELAPSED + 3))
  if [ $ELAPSED -ge $TIMEOUT ]; then
    warn "React is taking longer than expected. Check /tmp/foodapp-frontend.log"
    break
  fi
done

if grep -q "ERROR" /tmp/foodapp-frontend.log 2>/dev/null; then
  error "Frontend compilation failed. Check /tmp/foodapp-frontend.log"
fi

# ── Done ──────────────────────────────────────
echo ""
echo -e "${GREEN}════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✅  FoodApp is running!${NC}"
echo -e "${GREEN}════════════════════════════════════════════${NC}"
echo ""
echo -e "  🌐  Frontend  →  ${CYAN}http://localhost:3000${NC}"
echo -e "  🔌  Backend   →  ${CYAN}http://localhost:5500${NC}"
echo ""
echo -e "  ${YELLOW}Test accounts:${NC}"
echo -e "  👤 Customer  →  customer@test.com  / password123"
echo -e "  🍕 Owner     →  owner@test.com     / password123"
echo -e "  🔑 Admin     →  admin@test.com     / admin123"
echo ""
echo -e "  ${YELLOW}Logs:${NC}"
echo -e "  Backend   →  tail -f /tmp/foodapp-backend.log"
echo -e "  Frontend  →  tail -f /tmp/foodapp-frontend.log"
echo ""
echo -e "  Press ${RED}Ctrl+C${NC} to stop both servers."
echo ""

# Keep script alive and handle Ctrl+C cleanly
trap "echo ''; log 'Shutting down...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; success 'Stopped.'; exit 0" INT TERM

wait
