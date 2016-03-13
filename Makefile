build: node_modules
	@echo "Running build..."
	@node build

node_modules: package.json
	@echo "Installing packages..."
	@npm install

clean:
	@echo "Cleaning..."
	rm -rf build

.PHONY: build clean
