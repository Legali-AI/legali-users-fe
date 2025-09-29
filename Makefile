.PHONY: help dev prod dev-build prod-build dev-restart prod-restart dev-down prod-down

# Default target
help:
	@echo "Legali Frontend Docker Management"
	@echo "=================================="
	@echo ""
	@echo "Available commands:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Development commands
dev: ## Start development environment
	@echo "🚀 Starting development environment..."
	docker-compose -f docker-compose.dev.yml up -d
	@echo "✅ Development environment started!"
	@echo "📱 Application available at: http://localhost:3000"

dev-build: ## Build development image
	@echo "🔨 Building development image..."
	docker-compose -f docker-compose.dev.yml build
	@echo "✅ Development image built!"

dev-restart: ## Restart development environment
	@echo "🔄 Restarting development environment..."
	docker-compose -f docker-compose.dev.yml restart
	@echo "✅ Development environment restarted!"

dev-down: ## Stop development environment
	@echo "🛑 Stopping development environment..."
	docker-compose -f docker-compose.dev.yml down
	@echo "✅ Development environment stopped!"

# Production commands
prod: ## Start production environment
	@echo "🚀 Starting production environment..."
	docker-compose up -d legali-frontend
	@echo "✅ Production environment started!"
	@echo "📱 Application available at: http://localhost:3000"

prod-build: ## Build production image
	@echo "🔨 Building production image..."
	docker-compose build
	@echo "✅ Production image built!"

prod-restart: ## Restart production environment
	@echo "🔄 Restarting production environment..."
	docker-compose restart
	@echo "✅ Production environment restarted!"

prod-down: ## Stop production environment
	@echo "🛑 Stopping production environment..."
	docker-compose down
	@echo "✅ Production environment stopped!"
