import { ImageSourcePropType } from 'react-native';

export const productCategories = [
  { id: 'buque-borboleta', name: 'Buquê de Borboleta', catalogName: 'buquê de\nborboleta', image: require('@/assets/images/catalog/buque-borboleta.png') },
  { id: 'buque-flor-cetim', name: 'Buquê de Flor de Cetim', catalogName: 'buquê de\nflor de cetim', image: require('@/assets/images/catalog/flor-cetim.png') },
  { id: 'cesta-presente', name: 'Cesta de Presente', catalogName: 'cesta de\npresente', image: require('@/assets/images/catalog/cesta-presente.png') },
  { id: 'buque-maquiagem', name: 'Buquê de Maquiagem', catalogName: 'buquê de\nmaquiagem', image: require('@/assets/images/catalog/buque-maquiagem.png') },
  { id: 'fotos-polaroid', name: 'Fotos em Polaroid', catalogName: 'fotos em\npolaroid', image: require('@/assets/images/catalog/fotos-polaroid.png') },
  { id: 'presente-personalizado', name: 'Presente Personalizado', catalogName: 'presente\npersonalizado', image: require('@/assets/images/catalog/presente-personalizado.png') },
] as const;

export type ProductCategoryId = (typeof productCategories)[number]['id'];

export const productTypes = ['Simples', 'Médio', 'Completo', 'Especial'] as const;
export type ProductType = (typeof productTypes)[number];

export type Product = {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: ProductCategoryId;
  imagem: ImageSourcePropType;
  publicado: boolean;
  destaque?: boolean;
  prazoProducao?: string;
  tiposDisponiveis?: ProductType[];
  precosPorTipo?: Partial<Record<ProductType, number>>;
};

export type NewProduct = Omit<Product, 'id'> & { id?: string };

export const initialProducts: Product[] = [];
