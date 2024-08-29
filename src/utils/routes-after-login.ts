



export function redirectToBase(role: string, cityCouncilId?: string) {
  if(role === 'ADMIN') {
    return '/app/city-councils'
  }

  return `/app/city-councils/${cityCouncilId}/sessions`
}