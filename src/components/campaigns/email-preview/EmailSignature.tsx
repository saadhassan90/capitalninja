interface EmailSignatureProps {
  senderName: string;
  senderEmail: string;
}

export function EmailSignature({ senderName, senderEmail }: EmailSignatureProps) {
  return (
    <div className="border-t pt-4 space-y-1 text-sm">
      <div>Best,</div>
      <div className="font-medium">{senderName}</div>
      <div>Managing Director | Nvestiv</div>
      <div>E: {senderEmail}</div>
      <div>P: 1-888-831-9886</div>
      <div className="space-x-2 text-blue-500">
        <a href="#" className="hover:underline">Linkedin</a>
        <a href="#" className="hover:underline">Website</a>
      </div>
    </div>
  );
}