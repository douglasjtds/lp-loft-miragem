import { Reveal } from "@/components/motion/Reveal";
import { GaleriaGrade } from "@/components/sections/GaleriaGrade";
import { LinkExterno } from "@/components/ui/LinkExterno";
import { Section } from "@/components/ui/Section";
import { galeria, type GaleriaFoto } from "@/config/content";

/**
 * Galeria — landing-page-structure.md §5.4.
 *
 * Hospedagem vende por foto: é a seção mais consultada de qualquer anúncio. Aqui ela
 * vem logo depois da Experiência, que já mostrou o dia, para mostrar o lugar inteiro.
 *
 * Server component: título e link ficam no HTML sem JS. Só a grade com o lightbox é
 * client (`GaleriaGrade`), e recebe o mínimo por props.
 *
 * Hoje só existem fotos; vídeo é modelo de dados para o futuro, então fica fora da
 * lista até o componente saber renderizá-lo.
 */

function ehFoto(item: (typeof galeria.itens)[number]): item is GaleriaFoto {
  return item.tipo === "foto";
}

export function Galeria() {
  const fotos = galeria.itens.filter(ehFoto);
  if (fotos.length === 0) return null;

  return (
    <Section
      id={galeria.id}
      background="papel"
      aria-labelledby="galeria-titulo"
    >
      <Reveal>
        <h2 id="galeria-titulo" className="display-lg medida text-ancora">
          {galeria.titulo}
        </h2>
      </Reveal>

      {/* A grade entra como um bloco só: miniatura por miniatura seria uma cascata
          de vinte movimentos para ler uma foto. */}
      <Reveal atraso={120} className="mt-10 lg:mt-12">
        <GaleriaGrade fotos={fotos} textos={galeria.lightbox} />
      </Reveal>

      <LinkExterno
        link={galeria.instagram}
        className="text-ancora caption mt-6"
      />
    </Section>
  );
}
