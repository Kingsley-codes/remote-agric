export type ExportValue = string | number | boolean | null | undefined;
export type ExportData = { headers: string[]; rows: ExportValue[][] };
export type ExportParams = Record<string, string | undefined>;

/** Use the existing authenticated list endpoints, preserving filters on every page. */
export async function fetchExportRecords<T>(
  endpoint: string,
  filters: ExportParams,
  signal: AbortSignal,
): Promise<T[]> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters))
    if (value !== undefined) params.set(key, value);
  const records: T[] = [];
  let pages = 1;
  for (let page = 1; page <= pages; page++) {
    signal.throwIfAborted();
    params.set("page", String(page));
    const response = await fetch(`${endpoint}?${params}`, {
      credentials: "include",
      signal,
    });
    if (!response.ok)
      throw new Error(`Export failed (${response.status}). Please try again.`);
    const payload = await response.json();
    const pageCount = payload.pagination?.pages ?? payload.pages;
    if (
      payload.success !== true ||
      !Array.isArray(payload.data) ||
      !Number.isSafeInteger(pageCount) ||
      pageCount < 0
    ) {
      throw new Error("Unable to read export records. Please try again.");
    }
    if (page === 1) pages = Math.max(1, pageCount);
    records.push(...payload.data);
  }
  return records;
}

export function createCsv({ headers, rows }: ExportData): string {
  const cell = (value: ExportValue) => {
    let text = value == null ? "" : String(value);
    // Prevent user-entered values from becoming spreadsheet formulas.
    if (
      typeof value === "string" &&
      (/^[\s]*[=+@-]/.test(text) || /^[\t\r\n]/.test(text))
    )
      text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  };
  return (
    "\uFEFF" +
    [headers, ...rows].map((row) => row.map(cell).join(",")).join("\r\n") +
    "\r\n"
  );
}

export async function createDocx(
  title: string,
  { headers, rows }: ExportData,
): Promise<Blob> {
  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    WidthType,
    HeadingLevel,
  } = await import("docx");
  const doc = new Document({
    creator: "Remote Agric",
    title,
    styles: { default: { document: { run: { font: "Calibri", size: 22 } } } },
    sections: [
      {
        properties: {
          page: { margin: { top: 720, bottom: 720, left: 720, right: 720 } },
        },
        children: [
          new Paragraph({ text: title, heading: HeadingLevel.TITLE }),
          new Paragraph({
            text: `${rows.length} records | Generated ${new Date().toISOString()} | All matching records`,
            spacing: { after: 240 },
          }),
          // Field/value tables keep long emails and references readable on a portrait page.
          ...rows.flatMap((row, index) => [
            new Paragraph({
              text: `Record ${index + 1}`,
              heading: HeadingLevel.HEADING_2,
              keepNext: true,
            }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: headers.map(
                (header, column) =>
                  new TableRow({
                    children: [
                      header,
                      row[column] == null ? "" : String(row[column]),
                    ].map(
                      (text, i) =>
                        new TableCell({
                          width: {
                            size: i === 0 ? 30 : 70,
                            type: WidthType.PERCENTAGE,
                          },
                          shading: i === 0 ? { fill: "F0F5ED" } : undefined,
                          children: [
                            new Paragraph({
                              children: [new TextRun({ text, bold: i === 0 })],
                              spacing: { before: 60, after: 60 },
                            }),
                          ],
                        }),
                    ),
                  }),
              ),
            }),
            new Paragraph({ text: "", spacing: { after: 120 } }),
          ]),
        ],
      },
    ],
  });
  return Packer.toBlob(doc);
}

export function downloadExport(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}
