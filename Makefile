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
	rm -rf tmp
	rm -rf content/snapcraft/

fetch_snapcraft_docs: clean
	@echo "Fetching latest snapcraft docs..."
	@mkdir -p tmp
	@git clone https://github.com/ubuntu-core/snapcraft/ tmp/snapcraft
	@cp -r tmp/snapcraft/docs content/snapcraft/

.PHONY: build watch clean
