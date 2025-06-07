# VS Code Extension Development Makefile
# This Makefile provides convenient commands for developing the HelloWorld extension

# Variables
EXTENSION_NAME = helloworld
NODE_MODULES = node_modules
OUT_DIR = out
VSIX_FILE = $(EXTENSION_NAME)-*.vsix

# Default target
.DEFAULT_GOAL := help

# Help target - shows available commands
.PHONY: help
help: ## Show this help message
	@echo "Available commands for $(EXTENSION_NAME) VS Code Extension:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "Examples:"
	@echo "  make install    # Install dependencies"
	@echo "  make dev        # Start development with watch mode"
	@echo "  make debug      # Launch extension in debug mode"

# Installation and setup
.PHONY: install
install: ## Install dependencies using Yarn
	@echo "📦 Installing dependencies..."
	yarn install
	@echo "✅ Dependencies installed successfully!"

.PHONY: install-clean
install-clean: clean-deps install ## Clean install - remove node_modules and reinstall

# Build targets
.PHONY: build
build: ## Compile TypeScript source code
	@echo "🔨 Building extension..."
	yarn compile
	@echo "✅ Build completed!"

.PHONY: build-watch
build-watch: ## Build in watch mode for development
	@echo "👀 Starting build in watch mode..."
	yarn watch

.PHONY: dev
dev: build-watch ## Alias for build-watch (development mode)

# Quality checks
.PHONY: lint
lint: ## Run ESLint to check code quality
	@echo "🔍 Running linter..."
	yarn lint
	@echo "✅ Linting completed!"

.PHONY: test
test: ## Run the test suite
	@echo "🧪 Running tests..."
	yarn test
	@echo "✅ Tests completed!"

.PHONY: check
check: lint test ## Run all quality checks (lint + test)
	@echo "✅ All quality checks passed!"

# Debug and development
.PHONY: debug
debug: build ## Launch extension in VS Code debug mode
	@echo "🐛 Launching extension in debug mode..."
	@echo "Press F5 in VS Code or use 'Run Extension' from the debug panel"
	code --extensionDevelopmentPath="$(PWD)"

.PHONY: package
package: build ## Package extension into .vsix file
	@echo "📦 Packaging extension..."
	yarn vsce package
	@echo "✅ Extension packaged successfully!"

# Vite project management
.PHONY: vite-start
vite-start: ## Start Vite dev server (requires VITE_PROJECT_PATH)
	@if [ -z "$(VITE_PROJECT_PATH)" ]; then \
		echo "❌ Please set VITE_PROJECT_PATH variable"; \
		echo "Example: make vite-start VITE_PROJECT_PATH=../my-vite-project"; \
		exit 1; \
	fi
	@echo "🚀 Starting Vite dev server in $(VITE_PROJECT_PATH)..."
	cd "$(VITE_PROJECT_PATH)" && yarn dev

.PHONY: vite-build
vite-build: ## Build Vite project (requires VITE_PROJECT_PATH)
	@if [ -z "$(VITE_PROJECT_PATH)" ]; then \
		echo "❌ Please set VITE_PROJECT_PATH variable"; \
		echo "Example: make vite-build VITE_PROJECT_PATH=../my-vite-project"; \
		exit 1; \
	fi
	@echo "🏗️  Building Vite project in $(VITE_PROJECT_PATH)..."
	cd "$(VITE_PROJECT_PATH)" && yarn build

# Cleanup targets
.PHONY: clean
clean: clean-build ## Clean all generated files

.PHONY: clean-build
clean-build: ## Clean build output directory
	@echo "🧹 Cleaning build files..."
	rm -rf $(OUT_DIR)
	@echo "✅ Build files cleaned!"

.PHONY: clean-deps
clean-deps: ## Remove node_modules directory
	@echo "🧹 Cleaning dependencies..."
	rm -rf $(NODE_MODULES)
	@echo "✅ Dependencies cleaned!"

.PHONY: clean-package
clean-package: ## Remove packaged .vsix files
	@echo "🧹 Cleaning package files..."
	rm -f $(VSIX_FILE)
	@echo "✅ Package files cleaned!"

.PHONY: clean-all
clean-all: clean-build clean-deps clean-package ## Clean everything (build, deps, packages)
	@echo "✅ Everything cleaned!"

# Development workflow shortcuts
.PHONY: setup
setup: install build ## Complete setup for new development environment
	@echo "🎉 Development environment setup complete!"
	@echo "Next steps:"
	@echo "  1. Run 'make dev' to start development"
	@echo "  2. Press F5 in VS Code to debug"
	@echo "  3. Use 'make check' to run quality checks"

.PHONY: quick-start
quick-start: setup debug ## Setup and immediately start debugging

# Git workflow helpers
.PHONY: pre-commit
pre-commit: check build ## Run checks before committing
	@echo "✅ Pre-commit checks passed! Ready to commit."

# Environment info
.PHONY: info
info: ## Show environment information
	@echo "📋 Environment Information:"
	@echo "Node.js: $$(node --version 2>/dev/null || echo 'Not found')"
	@echo "Yarn: $$(yarn --version 2>/dev/null || echo 'Not found')"
	@echo "VS Code: $$(code --version 2>/dev/null | head -1 || echo 'Not found')"
	@echo "TypeScript: $$(npx tsc --version 2>/dev/null || echo 'Not found')"
	@echo "Current directory: $(PWD)"
	@echo "Extension name: $(EXTENSION_NAME)"

# Advanced targets
.PHONY: reinstall
reinstall: clean-deps install ## Reinstall all dependencies

.PHONY: rebuild
rebuild: clean-build build ## Clean rebuild

.PHONY: watch-test
watch-test: ## Run tests in watch mode
	@echo "👀 Running tests in watch mode..."
	yarn test --watch

# Check if tools are available
.PHONY: check-tools
check-tools: ## Verify required tools are installed
	@echo "🔧 Checking required tools..."
	@command -v node >/dev/null 2>&1 || { echo "❌ Node.js not found"; exit 1; }
	@command -v yarn >/dev/null 2>&1 || { echo "❌ Yarn not found"; exit 1; }
	@command -v code >/dev/null 2>&1 || { echo "❌ VS Code not found"; exit 1; }
	@echo "✅ All required tools are available!"
