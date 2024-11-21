import common from "@page/common/js/common";

// import Pagination from '@global/components/global/Pagination';

const storyLayout = {
	template: `
        <div v-if="mode===1" class="story-g sg-1">
            <div class="story-col">
                <div class="story-item">                    
                    <a class="story-img" :href="imgs[0].link">
                        <img class="img-fluid" :src="imgs[0].imgLink">
                    </a>
                </div>
            </div>
        </div>

        <div v-else-if="mode===5" class="story-g sg-2">
            <div class="story-col">
                <div class="story-item">
                    <a class="story-img" :href="imgs[0].link">
                        <img class="img-fluid" :src="imgs[0].imgLink">
                    </a>
                </div>
                <div class="story-item">
                    <a class="story-img" :href="imgs[1].link">
                        <img class="img-fluid" :src="imgs[1].imgLink">
                    </a> 
                </div>
            </div>
            <div class="story-col">
                <div class="story-item">
                    <a class="story-img" :href="imgs[2].link">
                        <img class="img-fluid" :src="imgs[2].imgLink">
                    </a>
                </div>
            </div>
            <div class="story-col">
                <div class="story-item">                    
                    <a class="story-img" :href="imgs[3].link">
                        <img class="img-fluid" :src="imgs[3].imgLink">
                    </a>
                </div>
                <div class="story-item">
                    <a class="story-img" :href="imgs[4].link">
                        <img class="img-fluid" :src="imgs[4].imgLink">
                    </a>
                </div>
            </div>
        </div>

        <div v-else-if="mode===4" class="story-g sg-3">
            <div class="story-col">
                <div class="story-item">
                    <a class="story-img" :href="imgs[0].link" :style="'background-image: url('+ imgs[0].imgLink + ')'"></a>
                </div>
                <div class="story-item">
                    <a class="story-img" :href="imgs[1].link" :style="'background-image: url('+ imgs[1].imgLink + ')'"></a>
                </div>
                <div class="story-item">
                    <a class="story-img" :href="imgs[2].link" :style="'background-image: url('+ imgs[2].imgLink + ')'"></a>
                </div>
                <div class="story-item">
                    <a class="story-img" :href="imgs[3].link" :style="'background-image: url('+ imgs[3].imgLink + ')'"></a>
                </div>
            </div>
        </div>

        <div v-else-if="mode===12" class="story-g sg-4">
            <div class="story-col">
                <div class="story-item">
                    <a class="story-img" :href="imgs[0].link">
                        <img class="img-fluid" :src="imgs[0].imgLink">
                    </a>
                </div>                
            </div>
            <div class="story-col">
                <div class="story-item">
                    <a class="story-img" :href="imgs[1].link">
                        <img class="img-fluid" :src="imgs[1].imgLink">
                    </a>
                </div>
                <div class="story-item">
                    <a class="story-img" :href="imgs[2].link">
                        <img class="img-fluid" :src="imgs[2].imgLink">
                    </a>
                </div>
            </div>     
        </div>

         <div v-else-if="mode===14" class="story-g sg-7">
            <div class="story-col">
                <div class="story-item">
                    <a class="story-img" :href="imgs[0].link">
                        <img class="img-fluid" :src="imgs[0].imgLink">
                    </a>
                </div>                
            </div>
            <div class="story-col">
                <div class="story-item">
                    <a class="story-img" :href="imgs[1].link">
                        <img class="img-fluid" :src="imgs[1].imgLink">
                    </a>
                </div>
                <div class="story-item">
                    <a class="story-img" :href="imgs[2].link">
                        <img class="img-fluid" :src="imgs[2].imgLink">
                    </a>
                </div>
                <div class="story-item">
                    <a class="story-img" :href="imgs[3].link">
                        <img class="img-fluid" :src="imgs[3].imgLink">
                        </a>
                </div>
                <div class="story-item">
                    <a class="story-img" :href="imgs[4].link">
                        <img class="img-fluid" :src="imgs[4].imgLink">
                    </a>
                </div>
            </div>     
        </div>

        <div v-else-if="mode===2" class="story-g sg-5">
            <div class="story-col">
                <div class="story-item">
                    <a class="story-img" :href="imgs[0].link">
                        <img class="img-fluid" :src="imgs[0].imgLink">
                    </a>
                </div>                
            </div>
            <div class="story-col">
                <div class="story-item">
                    <a class="story-img" :href="imgs[1].link">
                        <img class="img-fluid" :src="imgs[1].imgLink">
                    </a>
                </div>
            </div>     
        </div>

        <div v-else-if="mode===21" class="story-g sg-6">
            <div class="story-col">
                <div class="story-item">
                    <a class="story-img" :href="imgs[0].link">
                        <img class="img-fluid" :src="imgs[0].imgLink">
                    </a>
                </div>
                <div class="story-item">
                    <a class="story-img" :href="imgs[1].link">
                        <img class="img-fluid" :src="imgs[1].imgLink">
                    </a>
                </div>                
            </div>
            <div class="story-col">
                <div class="story-item">
                    <a class="story-img" :href="imgs[2].link">
                        <img class="img-fluid" :src="imgs[2].imgLink">
                    </a>
                </div>
            </div>     
        </div>
    `,
	props: {
		imgs: {
			type: Object,
		},
		mode: {
			type: String,
		},
	},
};

new Vue({
	el: "#app-story",
	components: {
		storyLayout,
	},
});
