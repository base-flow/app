import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/platform/workflow/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/platform/workflow/"!</div>
}
