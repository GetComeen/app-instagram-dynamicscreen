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
    const { h, ref, reactive, computed, watchEffect, watch } = vue;

    let isAccountDataLoaded = ref(false)
    let hasError = ref(false);
    const pages = reactive<any>([]);

    context.setAccountPickerVisibility(true);
    context.watchAccountSelected("facebook-driver", (accountId: number | undefined) => {
      isAccountDataLoaded.value = false;
      hasError.value = false;
      console.log(accountId, 'onchange')
      if (accountId === undefined) {
        pages.value = [];
        isAccountDataLoaded.value = true;
      } else {
        this.context.getAccountData("facebook-driver", "instagram_accounts").then((data: any) => {
          if (data) {
            pages.value = Object.keys(data).map((key) => {
              return { 'key': key, 'name': data[key] };
            });;
            isAccountDataLoaded.value = true;
            console.log('account data successfully fetched', pages.value)
          } else {
            hasError.value = true;
          }
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
      h(LoadingBlock, {
        class: "h-full",
        loading: !hasError.value && !isAccountDataLoaded.value
      }, [
        h("div", {
          class: "space-y-5"
        }, [
          hasError.value && h("div", {
            class: 'text-red-600 mb-6',
          }, this.t('modules.instagram.options.error')),
          !hasError.value && (h(FieldsRow, {}, [
            h(Field, { class: 'flex-1', label: this.t("modules.instagram.options.page_count")}, [
              h(NumberInput, { min: 0, max: 100, default: 1, ...update.option("pageNumber", { default: 1 }) })
            ]),
          ]),
          isAccountDataLoaded.value && h(Field, { class: 'flex-1', label: this.t("modules.instagram.options.account-picker.label") }, () => [
            h(Select, {
              options: pages.value,
              keyProp: 'key',
              valueProp: 'name',
              placeholder: this.t('modules.instagram.options.account-picker.placeholder'),
              ...update.option("pageId")
            })
          ])),
        ])
      ])
    ]
  }
}
