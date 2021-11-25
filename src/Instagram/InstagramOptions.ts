import {
  BaseContext,
  AssetDownload,
  IAssetsStorageAbility,
  IGuardsManager,
  ISlideContext,
  IPublicSlide,
  SlideModule,
  SlideUpdateFunctions
} from "dynamicscreen-sdk-js";

const en = require("../../languages/en.json");
const fr = require("../../languages/fr.json");

export default class InstagramOptionsModule extends SlideModule {
    constructor(context: ISlideContext) {
        super(context);
    }

    async onReady() {
        return true;
    };

    onMounted() {
        console.log('onMounted')
    }

    //@ts-ignore
    onErrorTracked(err: Error, instance: Component, info: string) {
    }

    //@ts-ignore
    onRenderTriggered(e) {
    }

    //@ts-ignore
    onRenderTracked(e) {
    }

    onUpdated() {
    }

    // @ts-ignore
    setup(props, ctx, update: SlideUpdateFunctions, OptionsContext) {
      const { h, ref, reactive } = ctx;

      let isAccountDataLoaded = ref(false)
      const pages = reactive({});

      OptionsContext.getAccountData("facebook", "instagram_pages", (accountId: number | undefined) => {
        isAccountDataLoaded.value = accountId !== undefined;
        console.log(accountId, 'onchange')
        if (accountId === undefined) {
          pages.value = {};
        }
      }, { extra: 'parameters' })
        .value
        .then((data: any) => {
          isAccountDataLoaded.value = true;
          pages.value = data;
          console.log('account data successfully fetched', pages)
        });

      const { Field, FieldsRow, NumberInput, Select } = OptionsContext.components

      return () => [
        h(FieldsRow, {}, [
          h(isAccountDataLoaded.value && Field, { class: 'flex-1', label: "Page Instagram" }, [
            h(Select, {
              options: [pages],
              placeholder: "Selectionnez une page à afficher",
              ...update.option("pageId")
            }),
          ]),
          h(Field, { class: 'flex-1', label: "Nombre de pages" }, [
            h(NumberInput, { min: 0, max: 100, default: 1, ...update.option("pageNumber") })
          ]),
        ]),
      ]
    }
}
