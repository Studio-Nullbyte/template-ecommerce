# Contributing to Studio Nullbyte

Thank you for considering contributing to Studio Nullbyte! This document outlines the process for contributing to this project.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:
- Be respectful and inclusive
- Use welcoming and inclusive language
- Be collaborative
- Focus on what is best for the community

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Install dependencies: `npm install`
4. Create a branch for your changes: `git checkout -b feature/your-feature-name`

## Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run linting
npm run lint

# Run tests
npm test

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/      # React contexts
├── hooks/         # Custom React hooks
├── lib/           # Utility libraries and configurations
├── pages/         # Page components
├── styles/        # Global styles and Tailwind config
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## Development Guidelines

### Code Style

- Follow the existing code style
- Use TypeScript for all new code
- Write meaningful commit messages
- Keep functions small and focused
- Add comments for complex logic

### Testing

- Write tests for new features
- Ensure all tests pass before submitting
- Test both happy path and edge cases
- Use descriptive test names

### Commit Messages

Follow conventional commits format:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Pull Request Process

1. Update documentation if needed
2. Add tests for new functionality
3. Ensure all tests pass
4. Update the README if necessary
5. Request review from maintainers

## Reporting Issues

When reporting issues:
1. Use the issue templates
2. Provide clear reproduction steps
3. Include environment information
4. Add screenshots if applicable

## Feature Requests

For feature requests:
1. Check if it already exists
2. Describe the problem it solves
3. Provide implementation suggestions
4. Consider the scope and complexity

## Questions?

If you have questions about contributing:
- Check existing issues and discussions
- Email us at: studionullbyte@gmail.com
- Open a discussion on GitHub

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

Thank you for contributing to Studio Nullbyte! 🚀
