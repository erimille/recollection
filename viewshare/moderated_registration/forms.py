from django import forms
from django.contrib.localflavor.us.us_states import US_STATES
from registration.forms import RegistrationForm
from viewshare.moderated_registration import models
from django.utils.translation import ugettext_lazy as _


class ViewShareRegistrationForm(RegistrationForm):

    first_name = forms.CharField(required=True,max_length=30, label=_("First Name"))

    last_name = forms.CharField(required=True,max_length=30, label=_("Last Name"))

    organization = forms.CharField(required=True, max_length=100, label=_("Organization"))

    org_type = forms.ChoiceField(label=_("Organization Type"),
                                 help_text=_("Please select the type of your organization, or 'Other' to enter an alternative"))

    org_text = forms.CharField(label=" ", max_length=100, required=False)

    org_state = forms.ChoiceField(label=_("Organization State"), choices = (('', 'Non-US'),) + US_STATES, required=False )

    reason =  forms.CharField(label=_("Reason"),
                                required=True,
                                widget=forms.Textarea,
                                help_text=_("Please let us know your interest in Viewshare!"))

    def __init__(self, *args, **kwargs):
        super(ViewShareRegistrationForm, self).__init__(*args, **kwargs)
        self.fields["org_type"].choices = [(b.key, b.value,) for b in models.OrganizationType.objects.all()] + [('other', 'Other',),]
        self.fields["username"].regex = r"^[\w.-_]+$"


    def clean_org_text(self):
        text = self.cleaned_data.get("org_text")
        type = self.cleaned_data.get("org_type")

        if type:
            if not type=="other":
                text = models.OrganizationType.objects.get(key=type).value
            elif not text:
                raise forms.ValidationError(_("Please tell us what type of organization you belong to"))
        return text