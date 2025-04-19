import Constants from "expo-constants";

interface ReceiptItem {
  titulo: string;
  quantidade: number;
  preco_unitario: number;
}

export interface SmartBillData {
  local: string;
  estabelecimento: string;
  data: string;
  hora: string;
  items: ReceiptItem[];
}

const apiKey = Constants.expoConfig?.extra?.apiKey; //@.env

const prompt = `
    Extrai da imagem o conteúdo do recibo em formato JSON.
    Não incluas aspas na tua resposta, sejam simples ou duplas.
    A estrutura deve ser:
    
    {
      "local": "cidade onde foi feita a compra",
      "estabelecimento": "nome do estabelecimento",
      "data": "formato DD-MM-AAAA",
      "hora": "formato HH:MM",
      "items": [
        {
            "quantidade": número inteiro,
          "titulo": "nome do produto",
          "preco_unitario": número decimal
        }
      ]
    }
    
    Completa nomes incompletos (ex: "Lisbo" -> "Lisboa"). 
    Não uses caracteres inválidos como "/" ou "|". 
    No campo "local", apenas a cidade, não incluas moradas ou números de porta.
    No nome dos produtos, apenas inclui o nome do produto, sem quantidades no nome.
    Sempre que encontrares palavras que não reconheças junto de outras, ignora, 
  `;

export async function processReceiptImage(
  imageUri: string
): Promise<SmartBillData> {
  const response = await fetch(imageUri);
  const blob = await response.blob();

  const base64data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

  const base64Image = base64data.split(",")[1];

  const payload = {
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: blob.type || "image/jpeg",
              data: base64Image,
            },
          },
        ],
      },
    ],
  };

  const geminiResponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const result = await geminiResponse.json();

  if (
    !geminiResponse.ok ||
    !result.candidates?.[0]?.content?.parts?.[0]?.text
  ) {
    throw new Error(result.error?.message || "Failed to process image");
  }

  const extractedText = result.candidates[0].content.parts[0].text;
  return JSON.parse(extractedText);
}

export function updateSmartBillData(
  currentData: SmartBillData,
  field: keyof SmartBillData,
  value: string
): SmartBillData {
  return {
    ...currentData,
    [field]: value,
  };
}

export function updateItemInSmartBill(
  currentData: SmartBillData,
  index: number,
  field: keyof ReceiptItem,
  value: string
): SmartBillData {
  const updatedItems = [...currentData.items];
  const numericValue =
    field === "quantidade" ? parseInt(value) : parseFloat(value);

  if (field === "quantidade" || field === "preco_unitario") {
    updatedItems[index][field] = isNaN(numericValue)
      ? (0 as never)
      : (numericValue as never);
  } else {
    updatedItems[index][field] = value as never;
  }

  return { ...currentData, items: updatedItems };
}
