import html2pdf from 'html2pdf.js';

export const generateMemoPDF = (element: HTMLElement, projectName: string) => {
  const opt = {
    margin: [0.75, 0.75],
    filename: `${projectName}-memo.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  // Clone the element to modify it for PDF generation
  const clonedElement = element.cloneNode(true) as HTMLElement;
  
  // Add PDF-specific styling
  clonedElement.style.fontFamily = 'Arial, sans-serif';
  clonedElement.style.color = '#1a1a1a';
  clonedElement.style.padding = '20px';
  
  // Style headers
  const headers = clonedElement.querySelectorAll('h1, h2, h3, h4');
  headers.forEach(header => {
    (header as HTMLElement).style.borderBottom = '1px solid #e5e7eb';
    (header as HTMLElement).style.paddingBottom = '8px';
    (header as HTMLElement).style.marginBottom = '16px';
    (header as HTMLElement).style.color = '#111827';
  });

  // Style paragraphs
  const paragraphs = clonedElement.querySelectorAll('p');
  paragraphs.forEach(p => {
    (p as HTMLElement).style.marginBottom = '12px';
    (p as HTMLElement).style.lineHeight = '1.6';
  });

  // Style lists
  const lists = clonedElement.querySelectorAll('ul, ol');
  lists.forEach(list => {
    (list as HTMLElement).style.marginBottom = '16px';
    (list as HTMLElement).style.paddingLeft = '24px';
  });

  return html2pdf().set(opt).from(clonedElement).save();
};