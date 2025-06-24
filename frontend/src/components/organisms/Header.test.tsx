import { render, screen } from '@testing-library/react'
import { Header } from './Header'

describe('Header', () => {
  it('renders logo, search, and user profile', () => {
    render(
      <Header
        userProfile={<div>User</div>}
        searchValue=""
        onSearchChange={() => {}}
        onSearch={() => {}}
      />
    )
    expect(screen.getByText('utmato')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByText('User')).toBeInTheDocument()
  })
}) 