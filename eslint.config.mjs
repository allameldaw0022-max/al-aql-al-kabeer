import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'

/** eslint-config-next 16 يصدّر flat config مباشرة — لا حاجة إلى FlatCompat. */
const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  {
    rules: {
      // توقيع useActionState يفرض معاملات قد لا تُستخدم — البادئة _ تعني ذلك صراحةً
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  { ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'] },
]

export default eslintConfig
