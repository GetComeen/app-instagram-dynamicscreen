import {
  ISlideOptionsContext,
  SlideOptionsModule,
  VueInstance
} from "dynamicscreen-sdk-js";

export default class InstagramOptionsModule extends SlideOptionsModule {
    async onReady() {
        return true;
    };

    setup(props: Record<string, any>, vue: VueInstance, context: ISlideOptionsContext) {
      const { h, ref, reactive } = vue;

      let isAccountDataLoaded = ref(false)
      const pages = reactive<any>({});

      this.context.getAccountData?.("facebook-driver", "instagram_pages", {
        onChange: (accountId: number | undefined) => {
          isAccountDataLoaded.value = accountId !== undefined;
          console.log(accountId, 'onchange')
          if (accountId === undefined) {
            pages.value = {};
          }
        },
      }, { extra: 'parameters' })
        .value?.then((data: any) => {
          isAccountDataLoaded.value = true;
          pages.value = data;
          console.log('account data successfully fetched', pages)
        });

      const update = context.update;
      const { Field, FieldsRow, NumberInput, Select } = this.context.components

      return () => [
        h(FieldsRow, {}, [
          h(isAccountDataLoaded.value && Field, { class: 'flex-1', label: this.t('modules.instagram.options.account-picker.label') }, [
            h(Select, {
              options: [pages],
              placeholder: this.t('modules.instagram.options.account-picker.placeholder'),
              ...update.option("pageId")
            }),
          ]),
          h(Field, { class: 'flex-1', label: this.t('modules.instagram.options.page_count') }, [
            h(NumberInput, { min: 0, max: 100, default: 1, ...update.option("pageNumber") })
          ]),
        ]),
      ]
    }
}
