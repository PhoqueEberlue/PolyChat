<script setup>
import Button from "./Button.vue";
import { MDBNavbar, MDBNavbarNav, MDBDropdownItem,
	MDBDropdown, MDBCollapse, MDBNavbarToggler, 
	MDBNavbarItem, MDBDropdownMenu, MDBDropdownToggle } from "mdb-vue-ui-kit";
</script>

<template>
	<div class="nav">
	<div class="void"> </div>
  <MDBNavbar expand="lg" light bg="light" container>
    <!-- Collapsible wrapper -->
    <MDBCollapse v-model="collapse5" id="navbarRightAlignExample">
      <MDBNavbarNav right class="mb-2 mb-lg-0">
        <!-- Right links -->
        <MDBNavbarItem to="/login" active>
          Home
        </MDBNavbarItem>
        <MDBNavbarItem href="#" active>
          Link
        </MDBNavbarItem>
        <!-- Navbar dropdown -->
        <MDBDropdown class="nav-item" v-model="dropdown8">
          <MDBDropdownToggle
            tag="a"
            class="nav-link"
            @click="dropdown8 = !dropdown8"
            >Dropdown</MDBDropdownToggle
          >
          <MDBDropdownMenu>
            <MDBDropdownItem href="#">Action</MDBDropdownItem>
            <MDBDropdownItem href="#">Another Action</MDBDropdownItem>
            <MDBDropdownItem href="#"
              >Something else here</MDBDropdownItem
            >
          </MDBDropdownMenu>
        </MDBDropdown>
        <MDBNavbarItem
          to="#"
          disabled
          tabindex="-1"
          aria-disabled="true"
        >
          Disabled
        </MDBNavbarItem>
        <!-- Right links -->
      </MDBNavbarNav>
    </MDBCollapse>
    <!-- Collapsible wrapper -->
  </MDBNavbar>
	</div>
</template>

<style>
ul {
 display:grid;
 grid-template-columns: 1fr 1fr 1fr 1fr;
}
.nav {
	position: fixed;
	display: grid;
	grid-template-columns: 70vw 30vw;
	top: 0;
	left: 0;
	width: 100vw;
}

.void {
	
}
/*@media (min-width: 1024px) {
	.top-header{
		
	}
}
*/
</style>
