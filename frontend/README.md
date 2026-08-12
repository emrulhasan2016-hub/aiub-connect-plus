# Drop-in instructions

All files below are safe to copy in as-is — they land in folders that are currently
empty (just `.gitkeep`), so nothing gets overwritten:

```
constants/colors.js
constants/fonts.js
constants/sizes.js
constants/spacing.js
constants/routes.js
constants/dummyImages.js
data/users.js
hooks/useAuth.js
hooks/useForm.js
utils/validation.js
utils/time.js
styles/globalStyles.js
components/PrimaryButton.js
components/SecondaryButton.js
components/InputField.js
screens/auth/SplashScreen.js
screens/auth/LoginScreen.js
screens/auth/RegisterScreen.js
screens/auth/ForgotPasswordScreen.js
```

**Do NOT touch:** `context/AuthContext.js`, `navigation/RootNavigator.js` — already built
by your teammate and already confirmed to work with this code (RootNavigator already does
`user ? <MainTabs /> : <AuthStack />`, so login/register calling `setUser()` is all it takes
to hand off).

## What changed vs. the guide

The guide's Login/Register screens call `login()` / `register()` from `AuthContext`. The
real `AuthContext` in this repo only exposes `{ user, setUser, loading, setLoading }` —
no `login()`, no `register()`, no `users`/`setUsers`. So:

- **LoginScreen** does its own lookup against `data/users.js`, then calls `setUser(found)`.
- **RegisterScreen** checks for a duplicate email against `data/users.js`, "creates" the
  account in memory, then calls `setUser(created)` to log them straight in. Because there's
  no shared `users` state to push the new account into, it won't be findable again after
  a reload — flag this to whoever owns `AuthContext.js` if the assignment needs registered
  accounts to persist across app restarts.
- **SplashScreen** and **ForgotPasswordScreen** needed no changes — they don't touch context.

## One file I couldn't safely write for you: `navigation/AuthStack.js`

Your `AuthStack.js` already exists and currently only wires up `"Splash"` and `"Login"`.
It needs two more `<Stack.Screen>` entries for `RegisterScreen` and `ForgotPasswordScreen`.
Since I don't have its current contents, paste them back to me (or run
`type shared\navigation\AuthStack.js` in your terminal) and I'll give you the exact edit —
keeping whatever navigator (`createNativeStackNavigator`, plain string route names) it
already uses, so nothing else breaks.

## Test

```
npx expo start -c
```

Demo accounts (also in `LoginScreen`'s helper text):

| Email | Password | Role |
|---|---|---|
| rafiul.islam@aiub.edu | Rafiul123 | Student |
| admin@aiub.edu | Admin123 | Admin |

## Commit to your branch

```
git checkout member1-auth        # or: git checkout -b member1-auth
git add constants/ data/users.js hooks/ utils/ styles/globalStyles.js components/PrimaryButton.js components/SecondaryButton.js components/InputField.js screens/auth/
git commit -m "Add auth screens (Splash, Login, Register, ForgotPassword) with shared constants, hooks, and components"
git push origin member1-auth
```

Then open a Pull Request into `main`/`develop` from `member1-auth`.
