import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { ActivityIndicator, Image, ImageSourcePropType, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { useStore } from '../context/StoreContext';
import { productCategories, productTypes, ProductType } from '../../data/catalog';
import { Button, Chip, colors, Field, Header, Screen, SectionTitle } from '../../components/admin/AdminUI';

const typeLabels: Record<ProductType, string> = { Simples: 'Simples', 'Médio': 'Médio', Completo: 'Completo', Especial: 'Especial' };
function parseMoney(input: string) { const value = Number(input.replace(',', '.')); return Number.isFinite(value) ? value : 0; }

export default function ProductFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { products, productsReady, addProduct, updateProduct } = useStore();
  const product = products.find((item) => item.id === id);
  const [name, setName] = useState(product?.nome ?? '');
  const [description, setDescription] = useState(product?.descricao ?? '');
  const [category, setCategory] = useState(product?.categoria ?? productCategories[0].id);
  const [productionTime, setProductionTime] = useState(product?.prazoProducao ?? '24–48 horas');
  const [photoSource, setPhotoSource] = useState<ImageSourcePropType | null>(product?.imagem ?? null);
  const [pickingPhoto, setPickingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [availableTypes, setAvailableTypes] = useState<ProductType[]>(product?.tiposDisponiveis ?? [...productTypes]);
  const [prices, setPrices] = useState<Record<ProductType, string>>({
    Simples: String(product?.precosPorTipo?.Simples ?? ''), 'Médio': String(product?.precosPorTipo?.['Médio'] ?? ''),
    Completo: String(product?.precosPorTipo?.Completo ?? product?.preco ?? ''), Especial: String(product?.precosPorTipo?.Especial ?? ''),
  });
  const [published, setPublished] = useState(product?.publicado ?? true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const selectedCategory = useMemo(() => productCategories.find((item) => item.id === category) ?? productCategories[0], [category]);

  useEffect(() => {
    if (!product) return;
    setPhotoSource(product.imagem);
    setName(product.nome); setDescription(product.descricao); setCategory(product.categoria); setProductionTime(product.prazoProducao ?? '24–48 horas'); setPublished(product.publicado);
    setAvailableTypes(product.tiposDisponiveis ?? [...productTypes]);
    setPrices({ Simples: String(product.precosPorTipo?.Simples ?? ''), 'Médio': String(product.precosPorTipo?.['Médio'] ?? ''), Completo: String(product.precosPorTipo?.Completo ?? product.preco), Especial: String(product.precosPorTipo?.Especial ?? '') });
  }, [id, product]);

  async function choosePhoto() {
    setPhotoError('');
    try {
      setPickingPhoto(true);
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setPhotoError('Permita o acesso às fotos nas configurações do celular para selecionar uma imagem.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
        base64: Platform.OS === 'web',
      });
      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        let uri = asset.uri;
        if (Platform.OS === 'web' && asset.base64) {
          uri = `data:${asset.mimeType ?? 'image/jpeg'};base64,${asset.base64}`;
        } else if (FileSystem.documentDirectory) {
          const extension = asset.uri.split('.').pop()?.split(/[?#]/)[0] || 'jpg';
          const durableUri = `${FileSystem.documentDirectory}product-${Date.now()}.${extension}`;
          await FileSystem.copyAsync({ from: asset.uri, to: durableUri });
          uri = durableUri;
        }
        setPhotoSource({ uri });
      }
    } catch {
      setPhotoError('Não foi possível abrir a galeria. Tente novamente.');
    } finally {
      setPickingPhoto(false);
    }
  }

  function toggleType(type: ProductType) { setAvailableTypes((items) => items.includes(type) ? items.filter((item) => item !== type) : [...items, type]); }
  async function save() {
    if (id && !productsReady) return;
    if (id && !product) { setError('Produto não encontrado no banco. Volte à lista e tente novamente.'); return; }
    const priceEntries = availableTypes.map((type) => parseMoney(prices[type])).filter((price) => price > 0);
    const basePrice = priceEntries.length ? Math.min(...priceEntries) : 0;
    if (availableTypes.some((type) => parseMoney(prices[type]) <= 0)) { setError('Informe um preÃ§o vÃ¡lido para cada tipo selecionado.'); return; }
    if (!name.trim() || !description.trim() || !availableTypes.length || !basePrice) { setError('Preencha nome, descrição, ao menos um tipo disponível e o preço correspondente.'); return; }
    const imagem = photoSource ?? selectedCategory.image;
    const data = { nome: name.trim(), descricao: description.trim(), categoria: category, prazoProducao: productionTime.trim(), tiposDisponiveis: availableTypes, precosPorTipo: Object.fromEntries(availableTypes.map((type) => [type, parseMoney(prices[type])])) as Partial<Record<ProductType, number>>, preco: basePrice, imagem, publicado: published };
    try {
      setSaving(true);
      if (product) {
        await updateProduct(product.id, data);
        router.replace('/telas-adm/Produtos');
      } else {
        const newId = await addProduct(data);
        router.replace({ pathname: '/telas-adm/ProdutoSalvo', params: { id: newId } });
      }
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Não foi possível salvar o produto.');
    } finally {
      setSaving(false);
    }
  }

  return <Screen><Header title={product ? 'Editar produto' : 'Criar produto'} subtitle="Adicione ou atualize os detalhes do produto." back />
    <TouchableOpacity style={styles.photo} onPress={choosePhoto} disabled={pickingPhoto} accessibilityRole="button" accessibilityLabel="Escolher foto na galeria">
      {pickingPhoto ? <ActivityIndicator color={colors.purple} /> : <Image source={photoSource ?? selectedCategory.image} style={styles.photoImage} resizeMode="contain" />}
      <Text style={styles.photoLabel}>{pickingPhoto ? 'Abrindo galeria...' : photoSource ? 'Toque para trocar a foto' : 'Toque para escolher foto da galeria'}</Text>
    </TouchableOpacity>
    {photoSource ? <TouchableOpacity onPress={() => setPhotoSource(null)}><Text style={styles.photoLabel}>Usar imagem padrão da categoria</Text></TouchableOpacity> : null}
    {photoError ? <Text style={styles.error}>{photoError}</Text> : null}
    <Field label="Nome do produto" value={name} onChangeText={setName} placeholder="Ex.: Buquê de Borboleta" />
    <Field label="Descrição" value={description} onChangeText={setDescription} placeholder="Descreva o produto e o que está incluso." multiline />
    <SectionTitle>Categoria</SectionTitle>
    {productCategories.map((item) => <TouchableOpacity key={item.id} onPress={() => setCategory(item.id)} style={[styles.category, category === item.id && styles.categorySelected]}><Text style={styles.categoryName}>{item.name}</Text><Text style={styles.check}>{category === item.id ? '●' : '○'}</Text></TouchableOpacity>)}
    <Text style={styles.helper}>Os produtos desta categoria também serão exibidos na respectiva aba do catálogo.</Text>
    <Field label="Prazo de produção" value={productionTime} onChangeText={setProductionTime} placeholder="Ex.: 24–48 horas" />
    <SectionTitle>Tipos disponíveis</SectionTitle>
    <View style={styles.types}>{productTypes.map((type) => <Chip key={type} label={typeLabels[type]} active={availableTypes.includes(type)} onPress={() => toggleType(type)} />)}</View>
    <SectionTitle>Preço por tipo</SectionTitle>
    {availableTypes.map((type) => <Field key={type} label={typeLabels[type]} value={prices[type]} onChangeText={(value) => setPrices((items) => ({ ...items, [type]: value }))} placeholder="R$ 0,00" keyboardType="numeric" />)}
    <SectionTitle>Disponibilidade no catálogo</SectionTitle>
    <View style={styles.types}><Chip label="Ativo · publicado" active={published} onPress={() => setPublished(true)} /><Chip label="Rascunho" active={!published} onPress={() => setPublished(false)} /></View>
    {error ? <Text style={styles.error}>{error}</Text> : null}
    <Button title={product ? 'Salvar alterações' : 'Salvar produto'} disabled={saving || (!!id && !productsReady)} onPress={save} />
  </Screen>;
}

const styles = StyleSheet.create({ photo: { alignItems: 'center', backgroundColor: '#F7F6FA', borderRadius: 17, height: 135, justifyContent: 'center', marginBottom: 15 }, photoImage: { height: 90, width: 100 }, photoLabel: { color: colors.muted, fontSize: 11, textAlign: 'center' }, category: { alignItems: 'center', borderColor: colors.line, borderRadius: 13, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6, padding: 11 }, categorySelected: { backgroundColor: colors.pale, borderColor: colors.purple }, categoryName: { color: colors.ink, fontSize: 11 }, check: { color: colors.purple, fontSize: 13 }, helper: { color: colors.muted, fontSize: 10, lineHeight: 15, marginBottom: 14, marginTop: 3 }, types: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 15 }, error: { color: colors.red, fontSize: 11, marginBottom: 10 } });
