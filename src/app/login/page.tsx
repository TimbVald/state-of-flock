import SignInForm from '@/components/auth/SignInForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Connexion | State of the Flock',
  description: 'Connexion au tableau de bord State of the Flock',
}

export default function LoginPage() {
  return <SignInForm />
}