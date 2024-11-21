var regionSelectTemplate = `
  <div class="form-group">
    <select id="select-area" v-model="selectedRegion" @change="changeRegion($event, selectedRegion)" name="region"
      class="form-control custom-ui" aria-invalid="false">
      <option v-for="(r, index) in region_array" :value="r.value" selected="">{{r.name}}</option>
    </select>
  </div>
`;

var areaTwTemplate = `
<div>
  <div class="form-row">
    <div class="form-group col-6">
      <select v-model="seletedCounty" @change="changeCounty(seletedCounty)" :name="namecounty"
        class="form-control full-border custom-ui" aria-invalid="false">
        <option v-for="(c, index) in counties" :value="c.name">{{c.name}}</option>
      </select>
    </div>
    <div class="form-group col-6">
      <select v-model="selectedZipcode" :name="namedistrict" class="form-control full-border custom-ui" aria-invalid="false">
        <option v-for="(z, index) in matchZipcode" :value="z.city">{{z.id}} {{z.city}}</option>
      </select>
      <input :name="namezipcode" placeholder="郵遞區號" type="hidden" :value="selectedZid">
    </div>
  </div>
  <div class="form-group">
    <div class="form-input">
      <input id="selectedAddressID" type="text" class="form-control full-border" :name="nameaddress" placeholder="請輸入地址"
        :value="selectedAddress" required>
    </div>
  </div>
</div>
`;

var areaCnTemplate = `
<div>
  <div v-if="provinceSelectMode" class="form-group">
    <select v-model="selectedProvince" class="form-control custom-ui" name="province" id="select-cn-district"
        required>
      <option v-for="(p, index) in cn_json" :value="p.name">{{p.name}}</option>
    </select>
  </div>
  <div v-else class="with-small-gap mb-3 h5">
    <span>中國大陸</span>
    <span>{{selectedProvince}}</span>
  </div>
  <div class="form-group">
    <select name="ischinacitizen" id="ischinacitizen" class="form-control custom-ui full-border" aria-invalid="false">
      <option value="true">我是中國公民</option> 
      <option value="false">非中國公民</option>
    </select>
  </div>
  <div class="form-group">
    <div class="form-input">
      <input type="text" id="recipient_customsID" name="RecipientCustomsID" value="" placeholder="請輸入中國公民身分證號碼" class="form-control full-border">
    </div>
  </div>
  <div class="form-group">
    <div class="form-input">
      <input id="cnAddress" type="text" class="form-control full-border" :name="nameaddress" placeholder="地址" :value="selectedAddress" required>
    </div>
  </div>
</div>`;

var areaOtherTemplate = `
<div>
    <div class="form-group">
      <div class="form-input">
        <input type="text" class="form-control full-border" :name="nameaddress" placeholder="Shipping Address" :value="userAddress" required>
      </div>
    </div>
    <div v-if="nameaddress === 'recipientAddress' && selectedRegion !== '香港' && selectedRegion !== '澳門'"
        class="row form-group">
      <div class="col">
        <div class="form-g">
          <div class="form-input">
            <input type="text" class="form-control full-border" name="recipientAddress2" placeholder="Shipping Address(optional)">
          </div>
        </div>
      </div>
    </div>
    <div v-if="nameaddress === 'recipientAddress' && selectedRegion !== '香港' && selectedRegion !== '澳門'"
        class="row form-group">
        <div class="col">
            <div class="form-g">
              <div class="form-input">
                <input type="text" class="form-control full-border" name="recipientAddress3"
                    placeholder="Shipping Address(optional)">
              </div>
            </div>
        </div>
    </div>
    <div v-if="selectedRegion !== '香港' && selectedRegion !== '澳門'" class="row form-group form-row">
      <div class="col">
        <div class="form-g">
          <div class="form-input">
            <input type="text" class="form-control full-border" name="recipientCity" placeholder="Shipping City" required>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="form-g">
          <div class="form-input">
            <input type="text" class="form-control full-border" name="recipientZipCode" placeholder="Shipping Zip" required>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!otherSelectMode" class="with-small-gap h5">
        <span v-if="window.shippingRegionEnglish"class="mr-2">{{window.shippingRegionEnglish}}</span>
        <span>{{selectedRegion}}</span>
    </div>
</div>`;

module.exports = {
	regionSelectTemplate: regionSelectTemplate,
	areaTwTemplate: areaTwTemplate,
	areaCnTemplate: areaCnTemplate,
	areaOtherTemplate: areaOtherTemplate,
};
