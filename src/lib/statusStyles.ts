export const PROJECT_STATUS_OPTIONS = [
  { label: 'Inquiry', value: 'Inquiry', color: 'bg-[#e371ff]/20 text-[#424790] border border-[#e371ff]/30' },
  { label: 'Designing', value: 'Designing', color: 'bg-[#92c6ff]/30 text-[#424790] border border-[#92c6ff]/40' },
  { label: 'Revisions', value: 'Revisions', color: 'bg-[#ff9161]/20 text-[#424790] border border-[#ff9161]/30' },
  { label: 'Approved', value: 'Approved', color: 'bg-[#b1ff29]/20 text-[#424790] border border-[#b1ff29]/30' },
  { label: 'Completed', value: 'Completed', color: 'bg-[#31ff6b]/20 text-[#424790] border border-[#31ff6b]/30' },
  { label: 'On Hold', value: 'On Hold', color: 'bg-[#5b2d19]/20 text-[#424790] border border-[#5b2d19]/30' },
  { label: 'Pending', value: 'Pending', color: 'bg-[#ff0000]/20 text-[#424790] border border-[#ff0000]/30' },
];

export const PAYMENT_STATUS_OPTIONS = [
  { label: 'Pending', value: 'Pending', color: 'bg-[#ff0000]/20 text-[#424790] border border-[#ff0000]/30' },
  { label: 'Partially Paid', value: 'Partially Paid', color: 'bg-[#b1ff29]/20 text-[#424790] border border-[#b1ff29]/30' },
  { label: 'Fully Paid', value: 'Fully Paid', color: 'bg-[#31ff6b]/20 text-[#424790] border border-[#31ff6b]/30' },
];

export function getProjectStatusBadgeClass(status?: string): string {
  switch (status) {
    case 'Inquiry':
      return 'bg-[#e371ff]/20 text-[#424790] border border-[#e371ff]/30';
    case 'Designing':
    case 'Planning':
    case 'Active':
      return 'bg-[#92c6ff]/30 text-[#424790] border border-[#92c6ff]/40';
    case 'Revisions':
      return 'bg-[#ff9161]/20 text-[#424790] border border-[#ff9161]/30';
    case 'Approved':
      return 'bg-[#b1ff29]/20 text-[#424790] border border-[#b1ff29]/30';
    case 'Completed':
      return 'bg-[#31ff6b]/20 text-[#424790] border border-[#31ff6b]/30';
    case 'On Hold':
      return 'bg-[#5b2d19]/20 text-[#424790] border border-[#5b2d19]/30';
    case 'Pending':
      return 'bg-[#ff0000]/20 text-[#424790] border border-[#ff0000]/30';
    default:
      return 'bg-[#92c6ff]/20 text-[#424790] border border-[#92c6ff]/30';
  }
}

export function getPaymentStatusBadgeClass(status?: string): string {
  switch (status) {
    case 'Pending':
      return 'bg-[#ff0000]/20 text-[#424790] border border-[#ff0000]/30';
    case 'Partially Paid':
      return 'bg-[#b1ff29]/20 text-[#424790] border border-[#b1ff29]/30';
    case 'Fully Paid':
    case 'Paid':
      return 'bg-[#31ff6b]/20 text-[#424790] border border-[#31ff6b]/30';
    default:
      return 'bg-[#ff0000]/20 text-[#424790] border border-[#ff0000]/30';
  }
}
