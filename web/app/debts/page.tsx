import Link from 'next/link';

type Debt = {
  id: string;
  name: string;
  email: string;
  debtSubject: string;
  debtAmount: number;
  status: string;
};

import DebtList from './DebtList';

export default function DebtsPage() {
  return <DebtList />;
}
