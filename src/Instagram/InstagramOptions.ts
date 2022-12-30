import {
  ISlideOptionsContext,
  SlideOptionsModule,
  VueInstance
} from "@comeen/comeen-play-sdk-js";

export default class InstagramOptionsModule extends SlideOptionsModule {
  async onReady() {
    return true;
  };

  setup(props: Record<string, any>, vue: VueInstance, context: ISlideOptionsContext) {
    const en = require("/home/scleriot/Dev/dynamicscreen/app-server/storage/apps//app-instagram-comeen-play/0.3.1/languages/en.json");
    const fr = require("/home/scleriot/Dev/dynamicscreen/app-server/storage/apps//app-instagram-comeen-play/0.3.1/languages/fr.json");
    const translator: any = this.context.translator;
    translator.addResourceBundle('en', 'instagram', en);
    translator.addResourceBundle('fr', 'instagram', fr);
    this.t = (key: string, namespace: string = 'instagram') => translator.t(key, { ns: namespace });

    const { h, ref, reactive, computed, watchEffect, watch } = vue;

    let isAccountDataLoaded = ref(false)
    const pages = reactive<any>([]);

    context.watchAccountSelected("facebook-driver", (accountId: number | undefined) => {
      isAccountDataLoaded.value = false;
      console.log(accountId, 'onchange')
      if (accountId === undefined) {
        pages.value = [];
        isAccountDataLoaded.value = true;
      } else {
        this.context.getAccountData("facebook-driver", "instagram_accounts").then((data: any) => {
          pages.value = Object.keys(data).map((key) => {
            return { 'key': key, 'name': data[key] };
          });;
          isAccountDataLoaded.value = true;
          console.log('account data successfully fetched', pages.value)
        })
      }
    })

    const update = context.update;
    const { Field, FieldsRow, NumberInput, Select, LoadingBlock } = this.context.components

    const valid = computed(() => update.option("pageId").modelValue && update.option("pageNumber").modelValue > 0)
    watchEffect(() => context.updateValidationStatus(valid.value))

    watch(() => update.option("pageId").modelValue, (value) => {
      const pageName = pages.value.find((page: any) => page.key === value)?.name
      context.updateAutoName(`Instagram - ${pageName}`)
    })

    return () => [
      h(FieldsRow, {}, [
        h(LoadingBlock, { loading: !isAccountDataLoaded.value }, () => [
          h(Field, { class: 'flex-1', label: this.t('modules.instagram.options.account-picker.label') }, [
            h(Select, {
              options: pages.value,
              keyProp: 'key',
              valueProp: 'name',
              placeholder: this.t('modules.instagram.options.account-picker.placeholder'),
              ...update.option("pageId")
            }),
          ]),
          h(Field, { class: 'flex-1', label: this.t('modules.instagram.options.page_count') }, [
            h(NumberInput, { min: 0, max: 100, default: 1, ...update.option("pageNumber", { default: 1 }) })
          ]),
        ])
      ]),
    ]
  }
}
