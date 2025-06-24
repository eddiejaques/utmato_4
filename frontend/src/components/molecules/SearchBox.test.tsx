import { render, screen, fireEvent } from '@testing-library/react'
import { SearchBox } from './SearchBox'

describe('SearchBox', () => {
  it('renders input and button, calls onSearch', () => {
    const onChange = jest.fn()
    const onSearch = jest.fn()
    render(
      <SearchBox value="test" onChange={onChange} onSearch={onSearch} />
    )
    const input = screen.getByPlaceholderText(/search/i)
    fireEvent.change(input, { target: { value: 'abc' } })
    expect(onChange).toHaveBeenCalledWith('abc')
    const button = screen.getByRole('button', { name: /search/i })
    fireEvent.click(button)
    expect(onSearch).toHaveBeenCalled()
  })
}) 