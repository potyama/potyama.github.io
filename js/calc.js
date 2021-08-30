    function calc(elem, jun, high,gr, gr_per_hour, h_per_hour, sj_per_hour, ad_salary, ad_per_hour) {
        const ele_val = document.getElementById('first').value = Math.round(elem * (sj_per_hour * 0.75));
        const jun_val = document.getElementById('second').value = Math.round(jun * (sj_per_hour * 1.5));
        const high_val = document.getElementById('third').value = Math.round(high * (h_per_hour * 1.5));
        const gr_val = document.getElementById('fourth').value = Math.round(gr * gr_per_hour);
        const ad_normal_val = document.getElementById('ad_normal').value = Math.round(ad_salary * ad_per_hour);
        const total_val = document.getElementById('total').value = Math.round(ele_val + jun_val + high_val + gr_val + ad_normal_val);
    }
