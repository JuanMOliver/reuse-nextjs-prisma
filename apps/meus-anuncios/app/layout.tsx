import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'ReUse! | Meus Anúncios',description:'MVP de gerenciamento de anúncios em Next.js'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang='pt-BR'><body>{children}</body></html>}
