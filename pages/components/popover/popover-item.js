Component({
  relations: {
      "./popover": {
          type: "parent"
      }
  },
  properties: {
      hasline: {
          type: Boolean,
          value: !1
      }
  },
  data: {
      height: 35,
      width: 62
  },
  methods: {
      onClick: function() {
          var e = {
              index: this.properties.index
          };
          this.triggerEvent("tap", e, {});
      },
      onHideCopy: function() {
        this.setData({"item.textSelected": !1});
    },
  }
});