import productsDefault from './products'

export const heroDefault = {
  title: 'Joias que abraçam sua história',
  subtitle:
    'Peças delicadas, banhadas com cuidado e feitas para durar — do primeiro presente à ocasião mais especial. Escolha no site e finalize a compra direto pelo WhatsApp.',
}

export const storyDefault = {
  title: 'Feita para quem gosta de se sentir única',
  paragraph1:
    'A Nüara nasceu do desejo de transformar pequenos gestos em lembranças — uma joia que se ganha, que se dá, que acompanha uma virada de página.',
  paragraph2:
    'Cada peça é selecionada com cuidado, pensando em durar no tempo e no gosto de quem a usa.',
}

export const faqDefault = [
  { id: 1, pergunta: 'Como funciona a compra na Nüara?', resposta: 'Você monta o carrinho aqui no site e, ao finalizar, é redirecionado pro WhatsApp com os itens já organizados na mensagem, pronto pra combinar pagamento e entrega com a gente.' },
  { id: 2, pergunta: 'Como funciona o pagamento?', resposta: 'O pagamento é combinado diretamente pelo WhatsApp — aceitamos Pix, cartão e outras formas, é só combinar por lá.' },
  { id: 3, pergunta: 'Posso comprar mais de uma peça de uma vez?', resposta: 'Pode! Adicione quantas peças quiser ao carrinho — todas aparecem já organizadas na mensagem que vai pro WhatsApp.' },
  { id: 4, pergunta: 'Como acompanho meu pedido?', resposta: 'O acompanhamento é feito direto pelo WhatsApp com a gente.' },
  { id: 5, pergunta: 'Quais as formas de pagamento aceitas?', resposta: 'Combinamos a forma de pagamento diretamente pelo WhatsApp (Pix, cartão, etc.).' },
  { id: 6, pergunta: 'Como faço para trocar ou devolver uma peça?', resposta: 'É só chamar a gente pelo WhatsApp pra combinar a troca ou devolução.' },
]

export const destaqueDefault = {
  modo: 'mais_vendidos',
  productIds: [1, 2, 3, 4],
}

const defaultContent = {
  hero: heroDefault,
  story: storyDefault,
  products: productsDefault,
  faq: faqDefault,
  destaque: destaqueDefault,
}

export default defaultContent