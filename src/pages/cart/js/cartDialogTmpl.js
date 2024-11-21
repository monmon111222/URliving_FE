module.exports = /*html*/ `
<transition name="slideup">
<div v-if="dataisload && isopen" id="dialog-market" :class="{active:isopen}" class="dialog-bottom dialog-item">
	<div @click.prevent="closeSelf" class="close-dialog dialog-mask mask" data-target="#dialog-market"></div>
	<div class="dialog-inner">
		<div class="cart-content">
			<a class="btn-delete" @click.prevent="closeSelf"><i class="icon-close"><i></a>
			<div class="">
				<div class="">
					<div class="item-detail">
						<div class="item-img">
						<!-- <img src="https://via.placeholder.com/245x315/0000FF/808080" /> -->
							<new-image v-if="selected.Images.length!==0" :url="selected.Images[0].Url" :size="'_w573_h730'" :name="alldatas.Name"></new-image>
						</div>
						<div class="item-info shopping-table">
							<div class="item-order mb-3">
								<div class="item-name font-bold h3">{{alldatas.Name}}</div>
								<div class="mt-3 d-flex justify-content-between">
									<div class="item-price">								
										<span v-if="alldatas.SellPrice !== alldatas.OriginPrice || alldatas.EventPrice >0" class="origin-price">NT$ {{alldatas.OriginPrice.toLocaleString()}}</span>
										<span class="sell-price">NT$ {{alldatas.EventPrice >0 && alldatas.EventPrice < alldatas.SellPrice ?alldatas.EventPrice.toLocaleString(): alldatas.SellPrice.toLocaleString()}}</span>
									</div>
									<div class="item-event">
										<div v-for="(event,index) in alldatas.Events" class="h6 mb-2">
											<span class="text-blue font-bold">{{event.Name}}</span>
										</div>
									</div>
								</div>
							</div>
							<div class="item-pick">
								<div class="item-color-wrap">
									<div class="product-color">
										<ul>
											<li @click="changeImg(color.ID)" class="item-color" v-for="(color, index) in alldatas.Colors" :class="{active: color.ID === selected.ID}">
												<div class="font-bold">{{color.Name}}</div>
											</li>
										</ul>
										
									</div>
								</div>
								<div class="item-size-wrap">
									<div class="r-select r-select-radio">
										<ul class="r-select__options">
											<li @click="selectSpec(spec)" v-for="(spec, index) in selected.Specs" :class="{weak: spec.Stock === 0, selected: spec.ID === selectedSpecID, preshow: alldatas.IsPreShow}">
												<a href="javascript:;">
													<span>{{spec.Name}} {{spec.Description}}</span>
												</a>
											</li>
										</ul>
									</div>
								</div>
								<div class="row">
									<div class="col-12 mb-2">
										<div class="UiQuantity w-100 bg-white counter">
											<a @click.prevent="reduceCount" class="UiQuantity__btn UiQuantity__btn--minus">–</a>
												<span class="UiQuantity__text">{{ counter &lt; 10 ? '0' + counter : counter }}</span>
											<a @click.prevent="addCount(selectedSpec === null ? 1:selectedSpec.Stock)" class="UiQuantity__btn UiQuantity__btn--plus">＋</a>
										</div>
									</div>
									<div class="col-12">
										<div @click.prevent="addToCart" class="product-buttons m-0">
											<button class="btn btn-primary w-100 btn-add2cart" :class="btnStyle"><span>{{btnDescriptionGenerate}}</span></button>
										</div>
									</div>
								</div>
							</div>
							
						</div>
						<div class="clearfix"></div>
						
					</div>
					
			</div>
		</div>			
	</div>
</div>
</div>
</transition>
`;
