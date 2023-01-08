<script setup>
//NOTE this is a vertical bar to show channels, and add some on the fly
//TODO its not vertical ? i hate css
import Button from "./Button.vue";
import Signout from "./Signout.vue";
import { MDBNavbar, MDBNavbarNav, MDBDropdownItem,
	MDBDropdown, MDBCollapse, MDBNavbarToggler, 
	MDBNavbarItem, MDBDropdownMenu, MDBDropdownToggle,
	MDBNavbarBrand} from "mdb-vue-ui-kit";
</script>

<script>
	export default {
		data: () => ({
			shouldLogin: false
		}),
		beforeMount(){
			this.shouldLogin = !$cookies.isKey("username");
		}
	}
</script>

<template>
	<div class="bgNav">
		<div class="nav">
			<MDBNavbar light bg="light" expand="xxl" container>
				<MDBNavbarBrand href="/">
					<img
						src="../assets/polytech.png"
						height="30"
						alt=""
						loading="lazy"
						class="btn"
					/>
					<span style="padding-left:10px"/>
					PolyChat
				</MDBNavbarBrand>
				<div class="void"> </div>
				<MDBNavbarNav v-for="(channel, index) in list_channel" :key=index  collapse="navbarNav">

					<Button :url='"/channel/" + channel.id_channel' :name="channel.name_channel" />
				</MDBNavbarNav>
			</MDBNavbar>
		</div>
	</div>
</template>

<style scoped>
ul {
	display:flex;
	align-items: center;
	justify-content: right;
}

.btn {
	margin-right: 0px;
	margin-left: 0px;
	margin-top: 5px;

}

a {
	display:flex;
	font-size: 20px;
	margin-top: 5px;
	margin-left:10px;
}

nav, .nav {
	position: fixed;
	display: grid;
	grid-template-columns: 1fr;
	top: 0;
	left: 0;
	width: 100vw;
	border: .5vw solid var(--color-background-soft);
	background-color: var(--color-background-soft);
}

.void {
	display: none;
}

@media (min-width: 1024px) {
	.void{
		display: block;
	}
}

</style>

<style>

.container-fluid {
	display: grid;
	width:100vw;
	grid-template-columns: 250px calc(100% - 250px - 1vw);
}

@media (min-width: 1024px) {

	.container-fluid {
		display: grid;
		width:100vw;
		grid-template-columns: 250px 70vw calc(30% - 250px - 1vw);
	}
}



</style>
