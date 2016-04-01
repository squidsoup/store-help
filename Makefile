TIP := $(shell git rev-parse HEAD)

build: node_modules 
	@echo "Running build..."
	@npm run build

watch:
	@echo "Running build with watch..."
	@npm run watch

node_modules: package.json
	@echo "Installing packages..."
	@npm install

clean:
	@echo "Cleaning..."
	@npm run clean
	rm -rf tmp
	rm -rf src/content/snapcraft/

fetch_snapcraft_docs: clean
	@echo "Fetching latest snapcraft docs..."
	@mkdir -p tmp
	@git clone https://github.com/ubuntu-core/snapcraft/ tmp/snapcraft
	@cp -r tmp/snapcraft/docs src/content/snapcraft/
	@echo "Annotating snapcraft docs with YAML frontmatter..."
	@node scripts/frontmatterise.js --path=src/content/snapcraft --layout=index.html
	@rm -rf tmp

serve: build
	@cd build && python -m SimpleHTTPServer 8000
	@echo "Serving site at http://localhost:8000"

test:
	@npm run test

tarball: build
	@echo "Creating tarball ubuntu-store-help-${TIP}.tgz."
	@cd build && tar -czf ../ubuntu-store-help-${TIP}.tgz .
	@echo "Done."

.PHONY: build watch fetch_snapcraft_docs clean serve test tarball
