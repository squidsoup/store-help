build: node_modules
	@echo "Running Metalsmith build..."
	@node_modules/.bin/metalsmith

node_modules: package.json
	@echo "Installing packages..."
	@npm install

.PHONY: build
