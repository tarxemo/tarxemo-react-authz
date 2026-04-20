# tarxemo-react-authz

A high-performance, premium React UI permission management library designed for `tarxemo-django-authz` v0.3.0+. It features zero-configuration component discovery, batched synchronization, and a sleek management interface.

## v0.2.0 Highlights (Intensive Update)
- 🚀 **Batched Sync**: Automatically batches all UI element registrations into a single network request per mount cycle.
- 💎 **Premium UI**: Redesigned Manager Modal with glassmorphism, smooth transitions, and real-time validation feedback.
- 🧩 **PBAC Support**: Support for Policy-Based Access Control via `objId` and `context` props.
- ✅ **Standardized Protocol**: Full integration with backend standardized DTOs for robust error handling.

## Installation

```bash
npm install tarxemo-react-authz
```

*Required peer dependencies: `@apollo/client`, `graphql`, `lucide-react`, `classnames`.*

## Setup

Wrap your application in the `AuthzProvider`. It now features an optimized synchronization engine.

```tsx
import { AuthzProvider } from 'tarxemo-react-authz';

export function App() {
  const { user, updateAuthz } = useUser();
  
  return (
    <AuthzProvider 
       userAuthorizedUiElements={user?.authorizedUiElements || []}
       onUpdateAuthorizedUiElements={updateAuthz}
       syncDebounceMs={50} // Optional debounce time for batch sync
    >
       <MainLayout />
    </AuthzProvider>
  );
}
```

## Usage

Protect any component with `<AuthzUI>`. Components discovered on the frontend are automatically registered in the backend registry in one efficient batch.

```tsx
import { AuthzUI } from 'tarxemo-react-authz';

function UserRow({ user }) {
  return (
    <tr>
      <td>{user.name}</td>
      <td>
        <AuthzUI 
          id="row-delete-btn" 
          requiredPermissions={['users.delete']}
          description="Deletes a user from the management table"
          objId={user.id} // Supports PBAC ownership checks
        >
          <button className="btn-danger">Delete</button>
        </AuthzUI>
      </td>
    </tr>
  );
}
```

## Management Mode (Config Mode)

Toggle "Config Mode" to manage permissions visually. In this mode, protected components are highlighted, and their security policies can be updated in real-time.

```tsx
const { configMode, toggleConfigMode } = useAuthz();

return (
  <button onClick={toggleConfigMode} className="premium-btn">
    {configMode ? '🔒 End Lockdown' : '🛠 Architect Mode'}
  </button>
);
```

### Visual Feedback
- **Emerald Green Highlights**: Component is authorized for the current user.
- **Amber Orange Highlights**: Component is restricted; permissions must be granted.

## Theming

The library is designed to feel premium out-of-the-box but adapts to your design tokens:

```css
:root {
  --color-primary: #2563eb; /* Blue-600 */
  --color-surface: #ffffff;
  --color-text: #111827;
}
```

## Advanced PBAC Integration

For complex rules (e.g., "only authors can edit"), pass additional context directly to the wrapper:

```tsx
<AuthzUI 
  id="edit-post" 
  context={{ postStatus: 'draft', timeElapsed: 24 }}
>
  <EditButton />
</AuthzUI>
```
# tarxemo-react-authz
