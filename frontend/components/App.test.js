// Write your tests here
import AppFunctional from "./AppFunctional"
import React from 'react'
import { render, screen, fireEvent } from "@testing-library/react"

test('sanity', () => {
  expect(false).toBe(false)
})

test('Render without errors', () => {
  render(<AppFunctional />)
})

test('has a title', () => {
  render(<AppFunctional />)

})