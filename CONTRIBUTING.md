# Contributing to TMDB TypeScript SDK

Thank you for your interest in contributing to the TMDB TypeScript SDK! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Install dependencies**: `npm install`
4. **Set up your API key**: You'll need a TMDB API key for testing. Create a `.env` file with:
   ```
   TMDB_API_KEY=your_api_key_here
   ```

## Development Workflow

1. **Create a feature branch**: `git checkout -b feature/your-feature-name`
2. **Make your changes**: Implement your feature or bug fix
3. **Add tests**: Write tests covering your changes
4. **Run tests**: Ensure all tests pass with `npm test`
5. **Check code style**: Run `npm run lint` to ensure your code follows our style guide
6. **Build the SDK**: Run `npm run build` to make sure everything compiles correctly
7. **Commit your changes**: Use clear and meaningful commit messages
8. **Push to your fork**: `git push origin feature/your-feature-name`
9. **Open a pull request**: Submit a PR from your fork to our `main` branch

## Coding Standards

- **TypeScript**: We use TypeScript with strict typing enabled
- **Documentation**: All public methods and types should have JSDoc comments
- **Testing**: All functionality should have corresponding tests
- **Code Style**: We follow the style configured in our ESLint and Prettier configs

## Working with Resources

When adding support for a new TMDB API endpoint:

1. Define appropriate types in `/src/types/`
2. Add endpoint constants in `/src/config/api-config.ts`
3. Implement the endpoint in the appropriate resource class
4. Add tests for the new functionality
5. Update documentation to reflect the changes

## Pull Request Process

1. Update the README.md if needed
2. Include tests for new functionality
3. Ensure your code passes all CI checks
4. Get approval from at least one maintainer
5. A maintainer will merge your PR when it's ready

## Adding Examples

Examples help users understand how to use the SDK. If adding a new feature, please:

1. Add example usage in the appropriate file in `/examples/`
2. Use clear variable names and add comments explaining complex operations

## Reporting Issues

When reporting issues, please include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior vs. actual behavior
- SDK version and environment details
- Relevant code examples or error messages

## Questions?

If you have questions about contributing, feel free to open an issue with the "question" label.

Thank you for contributing to the TMDB TypeScript SDK!
