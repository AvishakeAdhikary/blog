import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
  {
    ignores: ['.next/**', 'out/**', 'node_modules/**', 'public/**', 'next-env.d.ts']
  },
  ...nextCoreWebVitals,
  {
    rules: {
      // Pre-existing, intentional pattern throughout this codebase: syncing from an
      // external system (localStorage, matchMedia, navigator) or flagging client-mount
      // for SSR-hydration-safety. This rule is new in eslint-plugin-react-hooks v7 and
      // has no way to distinguish that from an actual anti-pattern.
      'react-hooks/set-state-in-effect': 'off'
    }
  }
];

export default eslintConfig;
