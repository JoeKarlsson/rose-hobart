import '@testing-library/jest-dom'

// Mock file imports
const mockFile = 'test-file-stub'

// Mock CSS and asset imports
vi.mock('.*\\.(css|scss)$', () => ({}))
vi.mock('.*\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$', () => mockFile)
