import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders a button with the correct text', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button', { name: /Click me/i })
    expect(button).toBeInTheDocument()
  })

  it('applies the correct CSS class for variant', () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByRole('button', { name: /Delete/i })
    expect(button).toHaveClass('bg-destructive')
  })

  it('applies the correct CSS class for size', () => {
    render(<Button size="sm">Small Button</Button>)
    const button = screen.getByRole('button', { name: /Small Button/i })
    expect(button).toHaveClass('h-9 px-3')
  })

  it('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    const button = screen.getByRole('button', { name: /Click me/i })
    await userEvent.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('matches snapshot', () => {
    const { container } = render(<Button>Snapshot</Button>)
    expect(container).toMatchSnapshot()
  })
})

