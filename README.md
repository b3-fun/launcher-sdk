# B3 Launcher SDK

A TypeScript SDK for easy integration with websites and web games.

## Installation

```bash
npm install @b3dotfun/bsmnt-launcher-sdk
```

## Usage

### Initialize the SDK

```typescript
import B3LauncherSDK from '@b3dotfun/bsmnt-launcher-sdk';

const sdk = new B3WebSDK({
  releaseType: "embedded",
  debug: true, // Enable debug logging,
});
```

### Calling APIs

Access all available APIs through methods on ``sdk``.
```typescript
// e.g. get channel status
const channelStatus = await sdk.getChannelStatus();
```

## API

### SDK Configuration

```typescript
interface SDKConfig {
  releaseType: "embedded" | "external";
  debug?: boolean;
  overwriteJwt?: string;
}
```

### Response Format

All API methods return a Promise with an ApiResponse object:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
```

## Error Handling

```typescript
const response = await sdk.setUserScore(100, "highscore");
if (!response.success) {
  console.error(`Error: ${response.error?.code} - ${response.error?.message}`);
}
```

## Development

### Building the SDK

```bash
npm run build
```

### Running tests

```bash
npm test
```

## License

MIT 