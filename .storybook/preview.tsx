import React from 'react'
import type { Preview } from "@storybook/react"
import { JotaiProvider } from '../src/stories/providers'
import "../src/styles/globals.css";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <JotaiProvider>
        <Story />
      </JotaiProvider>
    ),
  ],
}

export default preview
