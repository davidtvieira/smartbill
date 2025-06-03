import AsyncStorage from "@react-native-async-storage/async-storage";

type AIModel = "gemini-1.5-flash" | "gemini-1.5-pro";

const DEFAULT_MODEL_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

async function getApiKey(): Promise<string> {
  try {
    const apiKey = await AsyncStorage.getItem("geminiApiKey");
    if (!apiKey) {
      throw new Error("Chave da API nao introduzida.");
    }
    return apiKey;
  } catch (error) {
    console.error("Erro ao obter a chave da API:", error);
    throw new Error("Erro ao obter a chave da API");
  }
}

async function getModelEndpoint(): Promise<string> {
  try {
    const savedEndpoint = await AsyncStorage.getItem("aiModelEndpoint");
    return savedEndpoint || DEFAULT_MODEL_URL;
  } catch (error) {
    console.error("Erro ao obter o endpoint do modelo:", error);
    return DEFAULT_MODEL_URL;
  }
}

const prompt = `
    Extrai da imagem o conteúdo do recibo em formato JSON.
    Não incluas aspas na tua resposta, sejam simples ou duplas.
    A estrutura deve ser:
    
    {
      "local": "cidade onde foi feita a compra",
      "establishment": "nome do estabelecimento",
      "date": "formato DD-MM-AAAA",
      "time": "formato HH:MM",
      "items": [
        {
          "name": "nome do produto",
          "quantity": número inteiro,
          "unit_price": número decimal
          "category: "nome da categoria",
          "sub_category: "nome da subcategoria",
        }
      ]
    }
    
    Completa nomes incompletos (ex: "Lisbo" -> "Lisboa"). 
    Se existirem mais que 1 produto com o mesmo nome exatamente, adiciona apenas um produto mas com a quantidade total de todos os produtos com o mesmo nome.
    Não uses caracteres inválidos como "/" ou "|". 
    Na informação geral, se um campo não estiver disponivel não adiciones nada, apenas deixa vazio.
    No campo "local", apenas a cidade, não incluas moradas ou números de porta.
    No nome dos produtos, apenas inclui o nome do produto, sem quantidades no nome, a quantidade tem o seu campo próprio.
    O preço de cada produto, normalmente, está do lado direito do talão. Inclui sempre o preço do lado direito do talão, mesmo que este esteja por debaixo do nome.
    Primeiro deves definir a subcategoria e depois a categoria respectiva a essa subcategoria.
    As categorias e subcategorias devem ser uma das pré definidas:
    categorias: 
      Comida, Bebida, Higiene, Casa, Animais, Farmácia, Papelaria e Vestuario. 

    subcategorias: 
      Comida:
        Carne
        Peixe
        Mercearia
        Doces e Sobremesas
        Pastelaria
        Queijos e Charcutaria
        Laticinios
      Bebidas:
        Agua
        Sumos e Refrigerantes
        Bebidas Alcoolicas
        Bebidas Quentes
      Higiene:
        Higiene Pessoal
      Casa:
        Limpeza
        Decoracao
        Mobilia
        Jardim
        Construcao e Reformas
        Eletrônica
        Materiais de Construcao
      Animais:
        Alimentacao para Animais
        Higiene e Acessorios para Animais
      Farmácia:
        Medicamentos e Tratamentos
        Suplementos e Vitaminas
        Equipamentos Médicos e Primeiros Socorros
      Papelaria:
        Papelaria
      Vestuario:
        Vestuario

      Quando achares que o produto não se encaixa em nenhuma dessas subcategorias atribui aquela que achas mais proxima da verdadeira, nunca deixes nenhum campo vazio.

    Sempre que encontrares palavras que não reconheças junto de outras, ignora, 
  `;

export async function Api_Call(imageUri: string): Promise<{
  local: string;
  establishment: string;
  date: string;
  time: string;
  items: {
    name: string;
    quantity: number;
    unit_price: number;
    category: string;
    sub_category: string;
  }[];
}> {
  try {
    const [apiKey, modelEndpoint] = await Promise.all([
      getApiKey(),
      getModelEndpoint(),
    ]);

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

    const geminiResponse = await fetch(`${modelEndpoint}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await geminiResponse.json();

    if (
      !geminiResponse.ok ||
      !result.candidates?.[0]?.content?.parts?.[0]?.text
    ) {
      throw new Error(result.error?.message || "Failed to process image");
    }

    const extractedText = result.candidates[0].content.parts[0].text;
    return JSON.parse(extractedText);
  } catch (error) {
    console.error("Error in Api_Call:", error);
    throw error;
  }
}
