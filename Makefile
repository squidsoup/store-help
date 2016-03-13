build: node_modules
	@echo "Running build..."
	@node build

watch:
	@echo "Running build with watch..."
	@node build --watch=true

node_modules: package.json
	@echo "Installing packages..."
	@npm install

clean:
	@echo "Cleaning..."
	rm -rf build

.PHONY: build watch clean
