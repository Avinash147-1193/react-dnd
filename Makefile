.PHONY: help install install-npm install-yarn ci test build clean

help:
	@echo "Targets:"
	@echo "  make install       Install deps using npm (default)"
	@echo "  make ci            Clean install using npm ci"
	@echo "  make test          Run tests"
	@echo "  make build         Build the production bundle"
	@echo "  make clean         Remove build artifacts"
	@echo "  make install-yarn  Install deps using yarn (if you prefer yarn locally)"

install:
	npm install

install-npm:
	npm install

install-yarn:
	yarn install --frozen-lockfile

ci:
	npm ci

test:
	npm test

build:
	npm run build

clean:
	rm -rf dist build coverage .cache