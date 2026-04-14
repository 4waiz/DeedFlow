.PHONY: help install dev build start lint test test-watch test-e2e typecheck prisma-generate db-migrate db-deploy db-seed db-reset clean

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

help: ## Display this help message
	@echo "$(BLUE)DeedFlow - Make Commands$(NC)"
	@echo ""
	@echo "$(GREEN)Setup & Installation:$(NC)"
	@echo "  make install              Install all dependencies"
	@echo "  make env-setup            Create .env file from .env.example"
	@echo ""
	@echo "$(GREEN)Development:$(NC)"
	@echo "  make dev                  Start development server (http://localhost:3000)"
	@echo "  make build                Build for production"
	@echo "  make start                Start production server"
	@echo ""
	@echo "$(GREEN)Database:$(NC)"
	@echo "  make db-migrate           Run Prisma migrations (dev mode)"
	@echo "  make db-deploy            Deploy migrations to DB"
	@echo "  make db-seed              Seed database with sample data"
	@echo "  make db-reset             Reset database (migrations + seed)"
	@echo ""
	@echo "$(GREEN)Code Quality:$(NC)"
	@echo "  make lint                 Run ESLint"
	@echo "  make typecheck            Run TypeScript compiler check"
	@echo "  make test                 Run tests once"
	@echo "  make test-watch           Run tests in watch mode"
	@echo "  make test-e2e             Run Playwright E2E tests"
	@echo ""
	@echo "$(GREEN)Prisma:$(NC)"
	@echo "  make prisma-generate      Generate Prisma client"
	@echo "  make prisma-studio       Open Prisma Studio GUI"
	@echo ""
	@echo "$(GREEN)Utilities:$(NC)"
	@echo "  make clean                Remove node_modules and build artifacts"
	@echo "  make setup                Full setup (install, env, db-migrate, prisma-generate)"
	@echo "  make fresh                Fresh start (clean, install, setup)"
	@echo ""

# ============================================================================
# Setup & Installation
# ============================================================================

install: ## Install all npm dependencies
	@echo "$(BLUE)📦 Installing dependencies...$(NC)"
	npm install
	@echo "$(GREEN)✓ Dependencies installed$(NC)"

env-setup: ## Create .env file from .env.example
	@if [ -f .env ]; then \
		echo "$(YELLOW)⚠ .env file already exists$(NC)"; \
	else \
		if [ -f .env.example ]; then \
			cp .env.example .env; \
			echo "$(GREEN)✓ .env file created from .env.example$(NC)"; \
			echo "$(YELLOW)⚠ Remember to update database and auth credentials in .env$(NC)"; \
		else \
			echo "$(RED)✗ .env.example not found$(NC)"; \
			exit 1; \
		fi; \
	fi

# ============================================================================
# Development
# ============================================================================

dev: ## Start development server (http://localhost:3000)
	@echo "$(BLUE)🚀 Starting development server...$(NC)"
	npm run dev

build: ## Build for production
	@echo "$(BLUE)🔨 Building for production...$(NC)"
	npm run build
	@echo "$(GREEN)✓ Build complete$(NC)"

start: build ## Build and start production server
	@echo "$(BLUE)🚀 Starting production server...$(NC)"
	npm start

# ============================================================================
# Database
# ============================================================================

prisma-generate: ## Generate Prisma client
	@echo "$(BLUE)📊 Generating Prisma client...$(NC)"
	npm run prisma:generate
	@echo "$(GREEN)✓ Prisma client generated$(NC)"

db-migrate: prisma-generate ## Run Prisma migrations (dev mode - creates migrations)
	@echo "$(BLUE)📊 Running database migrations (dev)...$(NC)"
	npm run prisma:migrate
	@echo "$(GREEN)✓ Database migrated$(NC)"

db-deploy: prisma-generate ## Deploy migrations to database (production-safe)
	@echo "$(BLUE)📊 Deploying database migrations...$(NC)"
	npm run prisma:deploy
	@echo "$(GREEN)✓ Migrations deployed$(NC)"

db-seed: ## Seed database with sample data
	@echo "$(BLUE)🌱 Seeding database...$(NC)"
	npm run prisma:seed
	@echo "$(GREEN)✓ Database seeded$(NC)"

db-reset: db-migrate db-seed ## Reset database (migrations + seed)
	@echo "$(GREEN)✓ Database reset complete$(NC)"

prisma-studio: ## Open Prisma Studio GUI
	@echo "$(BLUE)📊 Opening Prisma Studio...$(NC)"
	npx prisma studio

# ============================================================================
# Code Quality
# ============================================================================

lint: ## Run ESLint
	@echo "$(BLUE)🔍 Linting code...$(NC)"
	npm run lint
	@echo "$(GREEN)✓ Linting complete$(NC)"

typecheck: ## Run TypeScript compiler check
	@echo "$(BLUE)🔍 Type checking...$(NC)"
	npm run typecheck
	@echo "$(GREEN)✓ Type check complete$(NC)"

test: ## Run tests once
	@echo "$(BLUE)🧪 Running tests...$(NC)"
	npm run test
	@echo "$(GREEN)✓ Tests complete$(NC)"

test-watch: ## Run tests in watch mode
	@echo "$(BLUE)🧪 Running tests in watch mode...$(NC)"
	npm run test:watch

test-e2e: ## Run Playwright E2E tests
	@echo "$(BLUE)🧪 Running E2E tests...$(NC)"
	npm run test:e2e
	@echo "$(GREEN)✓ E2E tests complete$(NC)"

# ============================================================================
# Utilities
# ============================================================================

clean: ## Remove node_modules and build artifacts
	@echo "$(YELLOW)🗑️  Cleaning up...$(NC)"
	rm -rf node_modules
	rm -rf .next
	rm -rf dist
	@echo "$(GREEN)✓ Cleanup complete$(NC)"

setup: install env-setup prisma-generate db-migrate ## Full initial setup
	@echo "$(GREEN)✓ Setup complete! Run 'make dev' to start$(NC)"

fresh: clean setup ## Fresh start (clean, install, full setup)
	@echo "$(GREEN)✓ Fresh setup complete! Run 'make dev' to start$(NC)"

# ============================================================================
# Default
# ============================================================================

.DEFAULT_GOAL := help
