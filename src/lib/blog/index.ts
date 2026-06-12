export type { BlogPost, BlogContent } from "./types";

import { istoriyaMakrameOtMoryakovDoInterera } from "./istoriya-makrame-ot-moryakov-do-interera";
import { kakVybratMakrameSvetilnikDlyaDoma } from "./kak-vybrat-makrame-svetilnik-dlya-doma";
import { uhodZaIzdeliyamiIzMakrame } from "./uhod-za-izdeliyami-iz-makrame";
import { filosofiyaSlowLivingIRuchnayaRabota } from "./filosofiya-slow-living-i-ruchnaya-rabota";
import { makrameAbazhurSvoimiRukamiSChegoNachat } from "./makrame-abazhur-svoimi-rukami-s-chego-nachat";
import { kakUkrasiteDetskuyuKomnatuMakrame } from "./kak-ukrasite-detskuyu-komnatu-makrame";
import { makrameVInterereSkandinvskiyStil } from "./makrame-v-interere-skandinavskiy-stil";
import { kakVyibratNaturalnyeMaterialyDlyaMakrame } from "./kak-vyibrat-naturalnye-materialy-dlya-makrame";
import { dizainMakrameSChegoNachatEsliVyNeKhudozhnik } from "./dizain-makrame-s-chego-nachat-esli-vy-ne-khudozhnik";
import { makrameIFengShui } from "./makrame-i-feng-shui";
import { makrameDlyaMolodozhenov } from "./makrame-dlya-molodozhenov";
import { makrameDlyaBalkonovILodzhiy } from "./makrame-dlya-balkonov-i-lodzhiy";
import { makrameVPodarok } from "./makrame-v-podarok";
import { makrameDlyaDetskoyBezopasnyeIdei } from "./makrame-dlya-detskoy-bezopasnye-idei";
import { makrameDlyaKafeIRestoranov } from "./makrame-dlya-kafe-i-restoranov";
import { makrameSumkiTrendLeta } from "./makrame-sumki-trend-leta";
import { kakUkhazhivatZaMakrameStirkaChistkaKhranenie } from "./kak-ukhazhivat-za-makrame-stirka-chistka-khranenie";
import { makrameVMalenkoyKvartire } from "./makrame-v-malenkoy-kvartire";

import type { BlogPost } from "./types";

export const blogPosts: BlogPost[] = [
  istoriyaMakrameOtMoryakovDoInterera,
  kakVybratMakrameSvetilnikDlyaDoma,
  uhodZaIzdeliyamiIzMakrame,
  filosofiyaSlowLivingIRuchnayaRabota,
  makrameAbazhurSvoimiRukamiSChegoNachat,
  kakUkrasiteDetskuyuKomnatuMakrame,
  makrameVInterereSkandinvskiyStil,
  kakVyibratNaturalnyeMaterialyDlyaMakrame,
  dizainMakrameSChegoNachatEsliVyNeKhudozhnik,
  makrameIFengShui,
  makrameDlyaMolodozhenov,
  makrameDlyaBalkonovILodzhiy,
  makrameVPodarok,
  makrameDlyaDetskoyBezopasnyeIdei,
  makrameDlyaKafeIRestoranov,
  makrameSumkiTrendLeta,
  kakUkhazhivatZaMakrameStirkaChistkaKhranenie,
  makrameVMalenkoyKvartire,
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
