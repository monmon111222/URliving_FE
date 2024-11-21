module.exports = `<transition name="slideup">
	<div v-if="dataisload && isopen" id="dialog-market" :class="{active:isopen}" class="dialog-bottom dialog-item">
		<div @click.prevent="closeSelf" class="close-dialog dialog-mask mask" data-target="#dialog-market"></div>
		<a style="position: absolute; top: -45px; right: 20px;" @click.prevent="closeSelf" class="modal-close" href="#"><i class="icon-close2"></i></a>
		<div class="dialog-inner pb-4 px-3 pt-3">
			<div class="one-page-content p-0 position-relative">
				<div class="">
					<div class="">
						<div class="item-detail p-0">
							<div class="item-right m-0 pr-3 shopping-table float-left">
								<div style="font-size: 20px;" class="item-name font-weight-bold mb-2">{{alldatas.Name}}</div>
								<small v-if="selectedSpec !== null && selectedSpec.PreOrder">{{alldatas.ArrivalExplanation}}</small>
								<div class="item-price h6 mt-2">								
									<span style="font-size: 20px;" class="sell-price">NT$ {{alldatas.EventPrice >0 && alldatas.EventPrice < alldatas.SellPrice ?alldatas.EventPrice.toLocaleString(): alldatas.SellPrice.toLocaleString()}}</span>
									<span style="color: #d1d0cf;" v-if="alldatas.SellPrice !== alldatas.OriginPrice || alldatas.EventPrice >0" class="origin-price">NT$ {{alldatas.OriginPrice.toLocaleString()}}</span>
								</div>
								<div v-for="(event,index) in alldatas.Events" class="h6 py-3">
								    <span class="free-label">活動</span>
									<span>{{event.Name}}</span>
								</div>
								<!--<div class="color-chose-txt">{{selected.Name}}</div>-->
								<div class="mt-3">
									<div class="item-color-wrap">
										<div class="product-color-wrap mb-2">
											<ul>
												<li @click="changeImg(color.ID)" class="product-color" v-for="(color, index) in alldatas.Colors" :class="{active: color.ID === selected.ID}">
													<a href="javascript:;">
														<img class="m-0" :src="color.PintSizePictureUrl+'?w=20&h=20'">
													</a>
												</li>
											</ul>
										</div>
									</div>
									<div class="item-size-wrap item-color-wrap">
										<div class="product-color-wrap">
											<ul class="">
												<li class="d-inline-block" @click="selectSpec(spec)" v-for="(spec, index) in selected.Specs">
													<a href="javascript:;" style="width: 45px;" class="product-color text-center" :class="{weak: spec.Stock === 0, selected: spec.ID === selectedSpecID, preshow: alldatas.IsPreShow}">
														<small style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);width:100%;">{{spec.Name}} {{spec.Description}}</small>
													</a>
												</li>
											</ul>
										</div>
									</div>
								</div>
								
							</div>

							<div class="item-img text-right p-0 mb-3 float-right">
								<new-image style="max-height: 200px; width: auto;" v-if="selected.Images.length!==0" :url="selected.Images[0].Url" :size="'_w720_h960'" :name="alldatas.Name"></new-image>
							</div>
							<div class="clearfix"></div>
							<div class="row">
								<div class="col-12 mb-2">
									<div class="text-center UiQuantity w-100 bg-white counter">
										<a href="#" @click.prevent="reduceCount" class="UiQuantity__btn UiQuantity__btn--minus float-left">–</a>
											<span class="UiQuantity__text">{{counter}}</span>
										<a href="#" @click.prevent="addCount(selectedSpec === null ? 1:selectedSpec.Stock)" class="UiQuantity__btn UiQuantity__btn--plus float-right">＋</a>
									</div>
								</div>
								<div class="col-12">
									<div @click.prevent="addToCart" class="product-buttons m-0">
										<a href="#" class="btn btn-primary w-100" :class="btnStyleGenerate"><span>{{btnDescriptionGenerate}}</span></a>
									</div>
								</div>
							</div>
						</div>
						
					</div>
				</div>
			</div>			
		</div>
	</div>
</transition>
`;
