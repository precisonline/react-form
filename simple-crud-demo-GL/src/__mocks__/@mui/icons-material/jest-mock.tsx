import React from 'react'

type JestMockProps = React.HTMLAttributes<HTMLSpanElement> & {
  'data-testid'?: string
}

const JestMock = (props: JestMockProps) => {
  const iconName = props['data-testid'] || 'jest-mock-icon'
  return <span data-testid={iconName} {...props} />
}

JestMock.displayName = 'JestMock'

export default JestMock
